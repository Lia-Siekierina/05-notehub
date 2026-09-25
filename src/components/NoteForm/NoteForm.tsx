import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { NoteTag } from "../../types/note";
import { createNote } from "../../services/noteService";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onCancel: () => void;
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

const initialValues: NoteFormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),

  content: Yup.string().max(500, "Content must be at most 500 characters"),

  tag: Yup.mixed<NoteTag>()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required"),
});

const NoteForm = ({ onCancel }: NoteFormProps) => {
  const queryClient = useQueryClient();

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel();
    },
  });

  const handleSubmit = (values: NoteFormValues) => {
    createNoteMutation.mutate(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>

          <Field className={css.input} id="title" name="title" type="text" />

          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>

          <Field
            className={css.textarea}
            id="content"
            name="content"
            as="textarea"
            rows={5}
          />

          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>

          <Field className={css.select} id="tag" name="tag" as="select">
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>

          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button className={css.cancelButton} type="button" onClick={onCancel}>
            Cancel
          </button>

          <button
            className={css.submitButton}
            type="submit"
            disabled={createNoteMutation.isPending}
          >
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default NoteForm;
