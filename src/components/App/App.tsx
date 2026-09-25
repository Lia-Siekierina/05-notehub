import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import css from "./App.module.css";
import { createNote, deleteNote, fetchNotes } from "../../services/noteService";
import type { NoteTag } from "../../types/note";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";

interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

const App = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", currentPage, search],
    queryFn: () => fetchNotes(currentPage, 12, search),
  });

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, 300);

  const handleCreateNote = (values: NoteFormValues) => {
    createNoteMutation.mutate(values);
  };

  const handleDelete = (id: string) => {
    deleteNoteMutation.mutate(id);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearch} />

        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        <button
          className={css.button}
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          Create note
        </button>
      </header>

      <main>
        {isLoading && <p>Loading notes...</p>}

        {isError && <p>Something went wrong. Please try again.</p>}

        {data && data.notes.length > 0 && (
          <NoteList notes={data.notes} onDelete={handleDelete} />
        )}
      </main>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSubmit={handleCreateNote}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default App;
