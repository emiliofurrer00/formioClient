import { QuestionWrapper } from "@/src/components/inputs";


export default async function FormPage({
    params,
}: {
    params: Promise<{ formGuid: string }>;
}) {
    const { formGuid } = await params;
    const formData = await fetch(process.env.API_URL + 'forms/' + formGuid).then(res => res.json());
    const { title, questions } = formData.form;
    console.log(formData);
    return (
        <div>
            <h1>{title}</h1>
            <div>
                {questions.map((question: any, index: number) => (
                    <div key={index}>
                        <QuestionWrapper questionData={question} position={index + 1} />
                    </div>
                ))}
            </div>
        </div>
    )
};