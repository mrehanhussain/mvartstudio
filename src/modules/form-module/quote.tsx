import type { Form } from '@/sanity/types'
import EnquiryForm from './enquiry-form'

export default function Quote({ form: _form }: { form: Form }) {
	return <EnquiryForm kind="quote" />
}
