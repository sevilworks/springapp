package com.springapp.springapp.service;

import com.springapp.springapp.model.Note;
import com.springapp.springapp.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private GrammarService grammarService;

    public List<Note> getAllNotes() {
        return noteRepository.findAll();
    }

    public Optional<Note> getNoteById(Long id) {
        return noteRepository.findById(id);
    }

    public Note createNote(Note note) {
        updateGrammarScore(note);
        return noteRepository.save(note);
    }

    public Note updateNote(Long id, Note noteDetails) {
        Optional<Note> opt = noteRepository.findById(id);
        if (opt.isPresent()) {
            Note note = opt.get();
            note.setTitle(noteDetails.getTitle());
            note.setContent(noteDetails.getContent());
            updateGrammarScore(note);
            return noteRepository.save(note);
        }
        return null;
    }

    public Note checkGrammar(Long id) {
        Optional<Note> opt = noteRepository.findById(id);
        if (opt.isPresent()) {
            Note note = opt.get();
            updateGrammarScore(note);
            return noteRepository.save(note);
        }
        return null;
    }

    public void deleteNote(Long id) {
        noteRepository.deleteById(id);
    }

    private void updateGrammarScore(Note note) {
        if (note.getContent() != null && !note.getContent().isEmpty()) {
            Double score = grammarService.checkGrammar(note.getContent());
            note.setGrammarScore(score);
        }
    }
}
