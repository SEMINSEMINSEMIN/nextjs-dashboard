// By adding the 'use server', you mark all the exported functions within the file as Server Actions.
// These server functions can then be imported and used in Client and Server components.
"use server";

import { z } from "zod"; // type validation library
import { sql } from "@vercel/postgres";
/**
 * Next.js has a Client-side Router Cache that stores the route segments in the user's browser for a time. 
 * Along with prefetching, this cache ensures that users can quickly navigate between routes while reducing the number of requests made to the server.

 * Since you're updating the data displayed in the invoices route, 
 * you want to clear this cache and trigger a new request to the server. 
 * You can do this with the revalidatePath function from Next.js:
 */
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { error } from "console";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        /**
         * Zod throws error if the customer field is empty as it expects a type string
         * 하지만 invalid_type_error 값을 추가하면, 오류 메세지를 지정할 수 있다
         */
        invalid_type_error: "Please select a customer.",
    }),
    /**
     * coerce: change, change string to a number while also validating its type
     * z.coerce.number():
     *     문자열을 숫자로 변환
     *     만약 문자열이 비어있으면 디폴트값은 0임.
     * gt(0, ...): 숫자로 변환한 값이 0보다 커야한다.
     */
    amount: z.coerce
        .number()
        .gt(0, { message: "Please enter an amount greater than $0." }),
    /**
     * z.enum은 미리 정의된 값들 중에서만 입력값을 허용하도록 제한합니다.
     * 예를 들어, 아래 코드에서 status 필드는 "pending" 또는 "paid" 값만 허용합니다.
     */
    status: z.enum(["pending", "paid"], {
        invalid_type_error: "Please select an invoice status.",
    }),
    date: z.string(),
});

// omit(): 기존 스키마에서 특정 필드를 제외한 새 스키마를 생성
// 제외할 필드를 키로 지정하고, true 값을 할당
// 결과: id와 date가 없는 새 스키마 CreateInvoice가 만들어진다.
const CreateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};

// prevState: contains the state passed from the useActionState hook
export async function createInvoice(prevState: State, formData: FormData) {
    /**
     * safeParse:
     *      return an object containing either a success or error field.
     */
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get("customerId"),
        amount: formData.get("amount"),
        status: formData.get("status"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Invoice.",
        };
    }

    const { customerId, amount, status } = validatedFields.data;

    const amountInCents = amount * 100;
    const date = new Date().toISOString().split("T")[0]; // create a new date with the format "YYYY-MM-DD" for the invoice's creation date:

    try {
        await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    } catch (error) {
        return {
            message: "Database Error: Failed to Create Invoice.",
        };
    }

    // Once the database has been updated, the /dashboard/invoices path will be revalidated,
    // and fresh data will be fetched from the server.
    revalidatePath("/dashboard/invoices");
    redirect("/dashboard/invoices");
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(
    id: string,
    prevState: State,
    formData: FormData
) {
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get("customerId"),
        amount: formData.get("amount"),
        status: formData.get("status"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Update Invoice.",
        };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;

    try {
        await sql`
            UPDATE invoices
            SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${id}
        `;
    } catch (error) {
        return {
            message: "Database Error: Failed to Update Invoice.",
        };
    }

    revalidatePath("/dashboard/invoices");
    redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
    try {
        await sql`
            DELETE FROM invoices WHERE id = ${id}
        `;
        revalidatePath("/dashboard/invoices");
        return { message: "Deleted Invoice." };
    } catch (error) {
        return {
            message: "Database Error: Failed to Delete Invoice.",
        };
    }
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData
) {
    try {
        await signIn("credentials", formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Invalid credentials.";
                default:
                    return "Something went wrong.";
            }
        }
        throw error;
    }
}
