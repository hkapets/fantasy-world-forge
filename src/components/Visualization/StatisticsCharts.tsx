import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, BookOpen, MapPin, Calendar } from 'lucide-react';

interface StatisticsChartsProps {
  worldId: string;
  characters: any[];
  loreItems: any[];
  notes: any[];
  maps: any[];
  relationships: any[];
  events: any[];
}

const COLORS = ['#6B46C1', '#059669', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];

export const StatisticsCharts: React.FC<StatisticsChartsProps> = ({
  worldId,
  characters,
  loreItems,
  notes,
  maps,
  relationships,
  events
}) => {
  // Статистика по расах персонажів
  const raceStats = characters.reduce((acc, char) => {
    const race = char.race || 'Невідомо';
    acc[race] = (acc[race] || 0) + 1;
    return acc;
  }, {});

  const raceData = Object.entries(raceStats).map(([race, count]) => ({
    name: race,
    value: count
  }));

  // Статистика по класах
  const classStats = characters.reduce((acc, char) => {
    const charClass = char.characterClass || 'Невідомо';
    acc[charClass] = (acc[charClass] || 0) + 1;
    return acc;
  }, {});

  const classData = Object.entries(classStats).map(([charClass, count]) => ({
    name: charClass,
    count
  }));

  // Статистика по типах лору
  const loreStats = loreItems.reduce((acc, item) => {
    const type = item.type || 'other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const loreData = Object.entries(loreStats).map(([type, count]) => ({
    name: type === 'races' ? 'Раси' :
          type === 'bestiary' ? 'Бестіарій' :
          type === 'geography' ? 'Географія' :
          type === 'history' ? 'Історія' :
          type === 'politics' ? 'Політика' :
          type === 'religion' ? 'Релігія' :
          type === 'languages' ? 'Мови' :
          type === 'magic' ? 'Магія' :
          type === 'artifacts' ? 'Артефакти' : 'Інше',
    count
  }));

  // Активність по місяцях (створення контенту)
  const activityData = Array.from({ length: 12 }, (_, month) => {
    const monthName = new Date(2024, month).toLocaleDateString('uk-UA', { month: 'short' });
    
    const charactersCount = characters.filter(char => {
      const date = new Date(char.createdAt);
      return date.getMonth() === month;
    }).length;

    const loreCount = loreItems.filter(item => {
      const date = new Date(item.createdAt);
      return date.getMonth() === month;
    }).length;

    const notesCount = notes.filter(note => {
      const date = new Date(note.createdAt);
      return date.getMonth() === month;
    }).length;

    return {
      month: monthName,
      персонажі: charactersCount,
      лор: loreCount,
      нотатки: notesCount
    };
  });

  // Загальна статистика
  const totalStats = [
    { name: 'Персонажі', value: characters.length, icon: Users, color: '#6B46C1' },
    { name: 'Лор', value: loreItems.length, icon: BookOpen, color: '#059669' },
    { name: 'Нотатки', value: notes.length, icon: BookOpen, color: '#F59E0B' },
    { name: 'Карти', value: maps.length, icon: MapPin, color: '#EF4444' },
    { name: 'Зв\'язки', value: relationships.length, icon: Users, color: '#3B82F6' },
    { name: 'Події', value: events.length, icon: Calendar, color: '#8B5CF6' }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '1.5rem',
      padding: '1rem'
    }}>
      {/* Загальна статистика */}
      <div className="card" style={{ padding: '1.5rem', gridColumn: 'span 2' }}>
        <h4 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <TrendingUp size={20} style={{ color: 'var(--fantasy-primary)' }} />
          Загальна статистика світу
        </h4>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem'
        }}>
          {totalStats.map(stat => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-primary)'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: stat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={20} style={{ color: 'white' }} />
                </div>
                <div>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: 'var(--text-primary)'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)'
                  }}>
                    {stat.name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Розподіл по расах */}
      {raceData.length > 0 && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <h5 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            Розподіл персонажів по расах
          </h5>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={raceData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {raceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Класи персонажів */}
      {classData.length > 0 && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <h5 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            Класи персонажів
          </h5>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={classData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-md)'
                }}
              />
              <Bar dataKey="count" fill="#6B46C1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Типи лору */}
      {loreData.length > 0 && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <h5 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            Розподіл лору
          </h5>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={loreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-md)'
                }}
              />
              <Bar dataKey="count" fill="#059669" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Активність створення контенту */}
      <div className="card" style={{ padding: '1.5rem', gridColumn: 'span 2' }}>
        <h5 style={{
          fontSize: '1rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '1rem'
        }}>
          Активність створення контенту
        </h5>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
            />
            <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-md)'
              }}
            />
            <Line type="monotone" dataKey="персонажі" stroke="#6B46C1" strokeWidth={2} />
            <Line type="monotone" dataKey="лор" stroke="#059669" strokeWidth={2} />
            <Line type="monotone" dataKey="нотатки" stroke="#F59E0B" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};