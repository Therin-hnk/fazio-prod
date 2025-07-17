import React, { useState } from 'react';
import ParticipantCard from './ParticipantCard';
import SearchBar from './SearchBar';
// import Pagination from './Pagination';

import { useKKiaPay } from 'kkiapay-react';

interface Participant {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
}

const ParticipantsSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;

  // Données d'exemple basées sur l'image
  const participants: Participant[] = [
    {
      id: '1',
      name: 'Amadou Diallo',
      category: 'Chant',
      description: 'Jeune talent de Dakar avec une voix exceptionnelle qui fait vibrer les foules.',
      image: '/images/img.png'
    },
    {
      id: '2',
      name: 'Fatou Sow',
      category: 'Danse',
      description: 'Danseuse contemporaine qui mélange traditions africaines et modernité.',
      image: '/images/img (1).png'
    },
    {
      id: '3',
      name: 'Kofi Mensah',
      category: 'Comédie',
      description: 'Humoriste talentueux connu pour ses sketchs sur la vie quotidienne africaine.',
      image: '/images/img (2).png'
    },
    {
      id: '4',
      name: 'Aïcha Touré',
      category: 'Chant',
      description: 'Chanteuse à la voix puissante, inspirée par les grandes divas africaines.',
      image: '/images/img (3).png'
    },
    {
      id: '1',
      name: 'Amadou Diallo',
      category: 'Chant',
      description: 'Jeune talent de Dakar avec une voix exceptionnelle qui fait vibrer les foules.',
      image: '/images/img.png'
    },
    {
      id: '2',
      name: 'Fatou Sow',
      category: 'Danse',
      description: 'Danseuse contemporaine qui mélange traditions africaines et modernité.',
      image: '/images/img (1).png'
    },
    {
      id: '3',
      name: 'Kofi Mensah',
      category: 'Comédie',
      description: 'Humoriste talentueux connu pour ses sketchs sur la vie quotidienne africaine.',
      image: '/images/img (2).png'
    },
    {
      id: '4',
      name: 'Aïcha Touré',
      category: 'Chant',
      description: 'Chanteuse à la voix puissante, inspirée par les grandes divas africaines.',
      image: '/images/img (3).png'
    }
  ];

  const filteredParticipants = participants.filter(participant =>
    participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentParticipants = filteredParticipants.slice(startIndex, startIndex + itemsPerPage);

  const { openKkiapayWidget } = useKKiaPay();

  const handleVote = (id: string, voteCount: number, price: number) => {
    console.log('Vote pour participant:', id);
    console.log('Nombre de votes:', voteCount);
    console.log('Prix total:', price);
    openKkiapayWidget({
      amount: price, // en FCFA
      api_key: process.env.PUBLIC_KKPAY_PUBLIC,
      sandbox: true,
    });
    // Logique de vote à implémenter
  };

  return (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg">
      <h1 className="text-xl font-bold text-gray-900 mb-8">Participants en compétition</h1>
      
      <SearchBar
        searchTerm={searchTerm}
        sortBy={sortBy}
        onSearchChange={setSearchTerm}
        onSortChange={setSortBy}
      />
      
      <div className="flex flex-wrap justify-center gap-6 mt-6">
        {currentParticipants.map((participant, index) => (
          <div className='w-full max-w-[350px]' key={participant.id}>
            <ParticipantCard
              key={participant.id}
              id={participant.id}
              name={participant.name}
              category={participant.category}
              description={participant.description}
              image={participant.image}
              onVote={handleVote}
              votePrice={100}
              totalVotes={index*2}
              youtubeLinks={[
                "https://www.youtube.com/watch?v=wvcQXmeKd1Q"
              ]}
            />
          </div>
        ))}
      </div>
      
      {/* {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )} */}
    </div>
  );
};

export default ParticipantsSection;