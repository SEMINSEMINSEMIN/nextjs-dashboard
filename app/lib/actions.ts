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

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(), // coerce: change, change string to a number while also validating its type
    status: z.enum(["pending", "paid"]), // z.enum은 미리 정의된 값들 중에서만 입력값을 허용하도록 제한합니다. 예를 들어, 위 코드에서 status 필드는 "pending" 또는 "paid" 값만 허용합니다.
    date: z.string(),
});

// omit(): 기존 스키마에서 특정 필드를 제외한 새 스키마를 생성
// 제외할 필드를 키로 지정하고, true 값을 할당
// 결과: id와 date가 없는 새 스키마 CreateInvoice가 만들어진다.
const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get("customerId"),
        amount: formData.get("amount"),
        status: formData.get("status"),
    });
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split("T")[0]; // create a new date with the format "YYYY-MM-DD" for the invoice's creation date:

    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;

    // Once the database has been updated, the /dashboard/invoices path will be revalidated,
    // and fresh data will be fetched from the server.
    revalidatePath("/dashboard/invoices");
    redirect("/dashboard/invoices");
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get("customerId"),
        amount: formData.get("amount"),
        status: formData.get("status"),
    });

    const amountInCents = amount * 100;

    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
    `;

    revalidatePath("/dashboard/invoices");
    redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
    await sql`
        DELETE FROM invoices WHERE id = ${id}
    `;
    revalidatePath("/dashboard/invoices");
}
