type QuestionOption = {
    label: string;
    value: string;
}

type QuestionProps = {
    questionData: {
        type: string;
        heading: string;
        options: Array<QuestionOption>;
    };
};

function TextField({ questionData }: QuestionProps) {
    return <input type="text" />;
}

function MultiChoice({ questionData }: QuestionProps) {
    return (
        <select>
            {questionData.options.map((option, index) => (
                <option key={index} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}

function getQuestionComponent(type: string) {
    switch (type) {
        case 'text':
            return TextField;
        case 'multiple-choice':
            return MultiChoice;
        default:
            return null;
    }
}

export function QuestionWrapper({ questionData, position }: QuestionProps & { position: number }) {
    const QuestionComponent = getQuestionComponent(questionData.type);
    if (!QuestionComponent) return null;

    return (
        <div>
            <h3>{position}. {questionData.heading}</h3>
            <QuestionComponent questionData={questionData} />
        </div>
    )
};