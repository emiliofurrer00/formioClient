import Form from "@/src/components/form";

export default async function FormPage({
    params,
}: {
    params: Promise<{ formGuid: string }>;
}) {
    const { formGuid } = await params;
    const formData = await fetch(process.env.API_URL + 'forms/' + formGuid).then(res => res.json());
    console.log(formData);

    return (
        <div>
            <Form formData={formData} />
        </div>
    )
};