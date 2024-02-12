import { EmailComposeForm } from "@/components/EmailComposeForm";

export default async function ComposePage() {
    return (
        <div className="w-full flex justify-center h-screen" >
            <EmailComposeForm />
        </div>
    );
}
