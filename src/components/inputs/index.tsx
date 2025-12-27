type QuestionOption = {
    id: number;
    label: string;
    value: string;
}

type QuestionDto = {
    id: number;
    type: string;
    heading: string;
    choices: Array<QuestionOption>;
}

type QuestionProps = {
    questionData: QuestionDto;
    handleChange: (questionId: number, value: any) => void;
    value?: any;
};

function TextField({ questionData, handleChange, value }: QuestionProps) {
    function handleValueChange(event: React.ChangeEvent<HTMLInputElement>) {
        handleChange(questionData.id, event.target.value);
    }
    return <input type="text" className="py-1 px-2 border rounded" onChange={handleValueChange} defaultValue={value}/>;
}

function TextArea({ questionData, handleChange, value }: QuestionProps) {
    function handleValueChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        handleChange(questionData.id, event.target.value);
    }
    return <textarea className="py-1 px-2 border rounded" onChange={handleValueChange} defaultValue={value}/>;
}

function SingleChoice({ questionData, handleChange, value }: QuestionProps) {
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        questionData && event.target.value && handleChange(questionData.id, event.target.value);
    };

    return (
        <div className="flex flex-col gap-2">
            {questionData.choices.map((option,) => (<div key={option.id} className="flex items-center gap-2">
                <input onChange={onChange} type="radio" key={`input ${option.id}`} value={option.value} name={`Question ${questionData.id}`} checked={value === option.value} />

                <label key={`label ${option.id}`}>{option.label}</label>
            </div>
            ))}
        </div>
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

export function QuestionWrapper({ questionData, position, handleChange, value }: QuestionProps & { position: number }) {
    const QuestionComponent = getQuestionComponent(questionData.type);
    if (!QuestionComponent) return null;
    return (
        <div className="py-2">
            <h3>{position}. {questionData.heading}</h3>
            <QuestionComponent questionData={questionData} handleChange={handleChange} value={value} />
        </div>
    )
};