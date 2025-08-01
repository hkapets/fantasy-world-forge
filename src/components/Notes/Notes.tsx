import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import { CreateNoteModal } from '../Modal/CreateNoteModal';
import { useNotesData, Note } from '@/hooks/useNotesData';
import { EntityTooltip } from '../Common/EntityTooltip';

interface NotesProps {
  currentWorldId: string | null;
}

const categories = [
  { value: 'all', label: 'Всі нотатки' },
  { value: 'ideas', label: 'Ідеї' },
  { value: 'plot', label: 'Сюжет' },
  { value: 'world', label: 'Світобудова' },
  { value: 'characters', label: 'Персонажі' },
  { value: 'quests', label: 'Квести' },
  { value: 'other', label: 'Інше' }
];

export const Notes: React.FC<NotesProps> = ({ currentWorldId }) => {
  const { notes, addNote, updateNote, deleteNote, searchNotes } = useNotesData(currentWorldId || '');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (!currentWorldId) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--text-secondary)'
      }}>
        Оберіть світ для роботи з нотатками
      </div>
    );
  }

  const filteredNotes = notes.filter(note => {
    const matchesSearch = searchQuery === '' || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleCreateNote = (noteData: Omit<Note, 'id' | 'worldId' | 'createdAt' | 'lastModified'>) => {
    addNote(noteData);
  };

  const handleEditNote = (noteData: Omit<Note, 'id' | 'worldId' | 'createdAt' | 'lastModified'>) => {
    if (editingNote) {
      updateNote(editingNote.id, noteData);
      setEditingNote(null);
    }
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setIsCreateModalOpen(true);
  };

  const handleDeleteNote = (noteId: string) => {
    if (confirm('Видалити нотатку?')) {
      deleteNote(noteId);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      {/* Заголовок */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '2rem' 
      }}>
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '700', 
            marginBottom: '0.5rem',
            color: 'var(--text-primary)'
          }}>
            Нотатки
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Організуйте свої ідеї та записи
          </p>
        </div>
        
        <button
          className="btn btn-primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={20} style={{ marginRight: '0.5rem' }} />
          Створити нотатку
        </button>
      </div>

      {/* Фільтри */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ 
          position: 'relative', 
          flex: '1', 
          minWidth: '300px' 
        }}>
          <Search 
            size={20} 
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
          <input
            type="text"
            placeholder="Пошук нотаток..."
            className="input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <select
          className="input"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ minWidth: '150px' }}
        >
          {categories.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {/* Список нотаток */}
      {filteredNotes.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: 'var(--text-secondary)'
        }}>
          {searchQuery || selectedCategory !== 'all' ? 'Нотаток не знайдено' : 'Немає створених нотаток'}
          <br />
          <button
            className="btn btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
            style={{ marginTop: '1rem' }}
          >
            <Plus size={20} style={{ marginRight: '0.5rem' }} />
            Створити першу нотатку
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredNotes.map(note => (
            <EntityTooltip
              key={note.id}
              entityType="note"
              entityId={note.id}
              worldId={currentWorldId}
            >
              <div className="card" style={{ padding: '1.5rem', cursor: 'pointer' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem'
                }}>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    margin: 0,
                    flex: 1,
                    marginRight: '1rem'
                  }}>
                    {note.title}
                  </h3>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn-icon btn-icon-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(note);
                      }}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      className="btn-icon btn-icon-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                      style={{ background: 'var(--danger)', color: 'white' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: 'var(--fantasy-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.75rem'
                }}>
                  {categories.find(c => c.value === note.category)?.label || 'Інше'}
                </div>

                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.5',
                  marginBottom: '1rem',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {note.content}
                </p>

                {note.tags.length > 0 && (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    marginBottom: '1rem'
                  }}>
                    {note.tags.map(tag => (
                      <span
                        key={tag}
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.5rem',
                          background: 'var(--bg-secondary)',
                          color: 'var(--text-muted)',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-primary)'
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)'
                }}>
                  Створено {new Date(note.createdAt).toLocaleDateString('uk-UA')}
                </div>
              </div>
            </EntityTooltip>
          ))}
        </div>
      )}

      <CreateNoteModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingNote(null);
        }}
        onSave={editingNote ? handleEditNote : handleCreateNote}
        editingNote={editingNote}
        currentWorldId={currentWorldId}
      />
    </div>
  );
};