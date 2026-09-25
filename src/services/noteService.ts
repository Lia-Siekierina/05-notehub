import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const API_URL = "https://notehub-public.goit.study/api";

const noteService = axios.create({
  baseURL: API_URL,
});

noteService.defaults.headers.common.Authorization = `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`;

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface CreateNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

export const fetchNotes = async (
  page: number,
  perPage: number,
  search: string = "",
): Promise<FetchNotesResponse> => {
  const response = await noteService.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      search,
    },
  });

  return response.data;
};

export const createNote = async (note: CreateNoteData): Promise<Note> => {
  const response = await noteService.post<Note>("/notes", note);

  return response.data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await noteService.delete(`/notes/${id}`);
};
