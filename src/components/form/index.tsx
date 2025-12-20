'use client'

import { useState } from "react";
import { QuestionWrapper } from "../inputs";

export default function Form({ formData }: { formData: any }) {
    const { title, questions, id } = formData.form;
    const [answers, setAnswers] = useState(formData?.draft?.answers || {});

    function handleSubmitDraft(event: React.FormEvent) {
        event.preventDefault();
        // Handle form submission logic here
        const requestData = {
            formId: id,
            answers: answers,
            userEmail: "emiliofurrer@gmail.com" // Replace with actual user email
        };
        console.log("Submitting draft:", requestData);
        // You can send requestData to your API here
        const fetchOptions: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        };
        const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/forms/${id}/submit`;
        fetch(url, fetchOptions)
            .then(response => response.json())
            .then(data => {
                console.log("Draft submitted successfully:", data);
            })
            .catch(error => {
                console.error("Error submitting draft:", error);
            });
    }

    function handleAnswerChange(questionId: number, value: any) {
        // Handle answer change logic here
        setAnswers((prevAnswers: any) => ({
            ...prevAnswers,
            [questionId]: value
        }));
    }
    return (
        <>
            <h1>{title}</h1>
            <div>
                {questions.map((question: any, index: number) => (
                    <div key={index}>
                        <QuestionWrapper questionData={question} position={index + 1} value={answers[question.id] || null} handleChange={handleAnswerChange} />
                    </div>
                ))}
            </div>
            <button className="py-1 px-3 border rounded cursor-pointer" onClick={handleSubmitDraft}>Submit</button>
        </>
    )
}