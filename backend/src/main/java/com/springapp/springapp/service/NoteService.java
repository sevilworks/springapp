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
        // Check grammar and set score
        if (note.getContent() != null && !note.getContent().trim().isEmpty()) {
            Double grammarScore = grammarService.checkGrammar(note.getContent());
            note.setGrammarScore(grammarScore);
        }
        return noteRepository.save(note);
    }

    public Note updateNote(Long id, Note noteDetails) {
        Optional<Note> optionalNote = noteRepository.findById(id);
        if (optionalNote.isPresent()) {
            Note note = optionalNote.get();
            note.setTitle(noteDetails.getTitle());
            note.setContent(noteDetails.getContent());
            
            // Re-check grammar when content is updated
            if (note.getContent() != null && !note.getContent().trim().isEmpty()) {
                Double grammarScore = grammarService.checkGrammar(note.getContent());
                note.setGrammarScore(grammarScore);
            }
            
            return noteRepository.save(note);
        }
        return null;
    }

    public Note checkGrammar(Long id) {
        Optional<Note> optionalNote = noteRepository.findById(id);
        if (optionalNote.isPresent()) {
            Note note = optionalNote.get();
            if (note.getContent() != null && !note.getContent().trim().isEmpty()) {
                Double grammarScore = grammarService.checkGrammar(note.getContent());
                note.setGrammarScore(grammarScore);
                return noteRepository.save(note);
            }
        }
        return null;
    }

    public void deleteNote(Long id) {
        noteRepository.deleteById(id);
    }
}


