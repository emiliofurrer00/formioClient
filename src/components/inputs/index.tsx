import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

type QuestionOption = {
  id: number;
  label: string;
  value: string;
};

type QuestionDto = {
  id: number;
  type: string;
  heading: string;
  choices: Array<QuestionOption>;
};

type QuestionProps = {
  questionData: QuestionDto;
  handleChange: (questionId: number, value: any) => void;
  value?: any;
  autosavedQuestionId?: number | null;
  handleAutosave?: (questionId: number, value: string) => void;
};

function TextField({ questionData, handleChange, value, handleAutosave }: QuestionProps) {
  function handleValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    handleChange(questionData.id, event.target.value);
  }
  return (
    <Input
      onBlur={(event) =>
        event.target.value && handleAutosave && handleAutosave(questionData.id, event.target.value)
      }
      type="text"
      className="max-w-xs"
      onChange={handleValueChange}
      defaultValue={value}
    />
  );
}

function TextArea({ questionData, handleChange, value, handleAutosave }: QuestionProps) {
  function handleValueChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    handleChange(questionData.id, event.target.value);
  }
  return (
    <Textarea
      onBlur={(event) =>
        event.target.value && handleAutosave && handleAutosave(questionData.id, event.target.value)
      }
      className="max-w-md"
      onChange={handleValueChange}
      defaultValue={value}
    />
  );
}

function SingleChoice({ questionData, handleChange, value, handleAutosave }: QuestionProps) {
  const onChange = (event: any) => {
    console.log('SingleChoice onChange', event.target.value);
    questionData && event.target.value && handleChange(questionData.id, event.target.value);
    event.target.value && handleAutosave && handleAutosave(questionData.id, event.target.value);
  };

  return (
    <RadioGroup className="flex flex-col gap-3 py-2">
      {questionData.choices.map((option) => (
        <div className="flex items-center space-x-2" key={option.id}>
          <RadioGroupItem
            value={option.value}
            id={`option-${option.id}`}
            onClick={() => onChange({ target: { value: option.value } })}
            checked={value === option.value}
          />
          <Label htmlFor={`option-${option.id}`}>{option.label}</Label>
        </div>
      ))}
    </RadioGroup>
  );
}

function getQuestionComponent(type: string) {
  switch (type) {
    case 'text':
      return TextField;
    case 'textarea':
      return TextArea;
    case 'single':
      return SingleChoice;
    default:
      return null;
  }
}

export function QuestionWrapper({
  questionData,
  position,
  handleChange,
  value,
  autosavedQuestionId,
  handleAutosave,
}: QuestionProps & { position: number }) {
  const QuestionComponent = getQuestionComponent(questionData.type);
  if (!QuestionComponent) return null;
  console.log({ autosavedQuestionId, questionId: questionData.id });
  return (
    <div className="py-2">
      <div className="flex gap-2">
        <h3>
          {position}. {questionData.heading}
        </h3>
        {autosavedQuestionId === questionData.id && (
          <span className="text-sm text-gray-500">(Autosaving...)</span>
        )}
      </div>
      <QuestionComponent
        handleAutosave={handleAutosave}
        questionData={questionData}
        handleChange={handleChange}
        value={value}
      />
    </div>
  );
}
