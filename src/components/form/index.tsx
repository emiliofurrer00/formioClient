'use client';

import { useState } from 'react';
import { QuestionWrapper } from '../inputs';
import { Button } from '@/components/ui/button';
import { useMutation, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';

const queryClient = new QueryClient();
type AnswerData = {
  /*  draftId: draft.id,
        questionId: answer.questionId,
        value: answer.value,
        createdAt: new Date(),
    */
  draftId: number;
  questionId: string;
  value: string;
  createdAt?: Date;
};

function formatClientSideAnswers(answers: any) {
  return Object.fromEntries(answers.map((answer: any) => [answer.questionId, answer]));
}

function handleSubmitDraft({
  answers,
  formId,
  setAutosavedQuestionId = undefined,
}: {
  answers: any;
  formId: number;
  setAutosavedQuestionId?: (id: number | null) => void;
}) {
  // Handle form submission logic here
  const requestData = {
    formId,
    answers,
    userEmail: 'emiliofurrer@gmail.com', // Replace with actual user email
  };
  console.log('Submitting draft:', requestData);
  // You can send requestData to your API here
  const fetchOptions: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  };
  const url = `${
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  }/forms/${formId}/submit`;
  return fetch(url, fetchOptions)
    .then((response) => response.json())
    .then((data) => {
      console.log('Draft submitted successfully:', data);
      if (setAutosavedQuestionId) {
        setAutosavedQuestionId(null);
      }
    })
    .catch((error) => {
      console.error('Error submitting draft:', error);
    });
}

function FormContent({ formData }: { formData: any }) {
  const { mutate, isPending } = useMutation({ mutationFn: handleSubmitDraft });
  const { form, draft } = formData;
  const { title, questions, id } = form;
  const [answers, setAnswers] = useState(formatClientSideAnswers(draft?.answers || []));
  const [autosavedQuestionId, setAutosavedQuestionId] = useState<number | null>(null);

  function handleAnswerChange(questionId: number, value: string) {
    // Handle answer change logic here
    const updatedAnswer = {
      [questionId]: {
        draftId: draft?.id || '0',
        questionId: questionId.toString(),
        value: value,
      },
    };
    setAnswers((prevAnswers: any) => ({
      ...prevAnswers,
      [questionId]: {
        draftId: draft?.id || '0',
        questionId: questionId.toString(),
        value: value,
      },
    }));
  }

  function handleAutosave(questionId: number, value: string) {
    const updatedAnswer = {
      [questionId]: {
        draftId: draft?.id || '0',
        questionId: questionId.toString(),
        value: value,
      },
    };
    setAnswers((prevAnswers: any) => ({
      ...prevAnswers,
      [questionId]: {
        draftId: draft?.id || '0',
        questionId: questionId.toString(),
        value: value,
      },
    }));
    setAutosavedQuestionId(questionId);
    mutate({ answers: updatedAnswer, formId: id, setAutosavedQuestionId });
  }

  return (
    <>
      <h1>{title}</h1>
      <div>
        {questions.map((question: any, index: number) => (
          <div key={index}>
            <QuestionWrapper
              questionData={question}
              position={index + 1}
              value={answers[question.id]?.value || null}
              handleChange={handleAnswerChange}
              autosavedQuestionId={autosavedQuestionId}
              handleAutosave={handleAutosave}
            />
          </div>
        ))}
      </div>
      <Button className="cursor-pointer" onClick={() => mutate({ answers, formId: id })}>
        <Spinner className={isPending ? 'block w-6 h-6' : 'hidden'} />
        {isPending ? 'Submitting...' : 'Submit'}
      </Button>
    </>
  );
}

export default function Form({ formData }: { formData: any }) {
  return (
    <QueryClientProvider client={queryClient}>
      <FormContent formData={formData} />
    </QueryClientProvider>
  );
}
