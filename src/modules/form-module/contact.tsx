import type { Form } from '@/sanity/types'
import EnquiryForm from './enquiry-form'

export default function Contact({ form: _form }: { form: Form }) {
	return <EnquiryForm kind="contact" />
}
