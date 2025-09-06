//previous working code


// import moment from 'moment';
// import React, { useState } from 'react'
// import CandidateFeedbackDialog from './CandidateFeedbackDialog';
// import useDebounce from '@/hooks/useDebounce';

// function CandidatesList({ candidateList = [] }) {
//     const [filterRange, setFilterRange] = useState('all');
//     const [dropdownOpen, setDropdownOpen] = useState(false);
//     const [search, setSearch] = useState('');
//     const debouncedSearch = useDebounce(search, 400);

//     const filteredCandidates = candidateList.filter(candidate => {
//         const rating = candidate?.feedback?.feedback?.rating?.totalRating ?? 0;
//         // Add debounced search filter (by name)
//         const matchesSearch = candidate?.userName?.toLowerCase().includes(debouncedSearch.toLowerCase());
//         let rangeMatch = true;
//         switch (filterRange) {
//             case '0-3':
//                 rangeMatch = rating >= 0 && rating <= 3;
//                 break;
//             case '4-6':
//                 rangeMatch = rating >= 3 && rating <= 6;
//                 break;
//             case '7-10':
//                 rangeMatch = rating >= 6 && rating <= 10;
//                 break;
//             default:
//                 rangeMatch = true;
//         }
//         return matchesSearch && rangeMatch;
//     });

//     return (
//         <div>
//             {/* Header and Filter */}
//             <div className="flex justify-between items-center my-5">
//                 <h2 className='font-bold'>Candidates ({filteredCandidates.length})</h2>
//                 <input
//                     type="text"
//                     placeholder="Search candidates..."
//                     value={search}
//                     onChange={e => setSearch(e.target.value)}
//                     className="border rounded px-2 py-1"
//                 />
//                 {/* ...existing filter dropdown... */}
//             </div>
//             {filteredCandidates?.map((candidate, index) => (
//                 <div key={index} className="p-5 flex gap-3 items-center justify-between bg-white rounded-lg">
//                     <div className='flex items-center gap-5'>
//                         <h2 className="bg-primary p-3 px-4.5 font-bold text-white rounded-full">{candidate.userName[0]}</h2>
//                         <div>
//                             <h2 className='font-bold'>{candidate?.userName}</h2>
//                             <h2 className='text-sm text-gray-500'>
//                                 Completed On: {moment(candidate?.created_at).format('MMM DD, yyyy')}
//                             </h2>
//                         </div>
//                     </div>
//                     <div className='flex gap-3 items-center'>
//                         <h2 className='font-bold text-green-500'>
//                             {candidate?.feedback?.feedback?.rating?.totalRating}/10
//                         </h2>
//                         <CandidateFeedbackDialog candidate={candidate} />
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// }

// export default CandidatesList;


// prev code + filter option

import moment from 'moment';
import React, { useState } from 'react';
import CandidateFeedbackDialog from './CandidateFeedbackDialog';
import useDebounce from '@/hooks/useDebounce';
import { Search, SearchIcon } from "lucide-react";
import { Filter } from "lucide-react";



function CandidatesList({ candidateList = [] }) {
    const [filterRange, setFilterRange] = useState('all');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 400);

    const filteredCandidates = candidateList.filter(candidate => {
        const rating = candidate?.feedback?.feedback?.rating?.totalRating ?? 0;
        const matchesSearch = candidate?.userName?.toLowerCase().includes(debouncedSearch.toLowerCase());

        let rangeMatch = true;
        switch (filterRange) {
            case '0-4':
                rangeMatch = rating >= 0 && rating <= 4;
                break;
            case '4-7':
                rangeMatch = rating > 4 && rating <= 7;
                break;
            case '7-10':
                rangeMatch = rating > 7 && rating <= 10;
                break;
            default:
                rangeMatch = true;
        }
        return matchesSearch && rangeMatch;
    });

    return (
        <div>
            {/* Header and Filter */}
            <div className="flex justify-between items-center my-5 gap-3">
                <h2 className="font-bold">
                    Candidates ({filteredCandidates.length})
                </h2>

                {/* Search */}

                <div className='flex items-center gap-4'>
                    <Search />
                    <input
                        type="text"
                        placeholder="Search candidates..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="rounded px-2 py-1 bg-white"
                    />
                </div>

                {/* Filter Dropdown */}
                <div className="relative flex items-center justify-between gap-4">
                    <h2 className='font-bold'>Score Filter</h2>
                    <Filter />
                    <button
                        onClick={() => setDropdownOpen(prev => !prev)}
                        className="px-3 py-1 rounded bg-white hover:white-100 w-20 cursor-pointer"
                    >
                        {filterRange === 'all' ? 'All' : filterRange}
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 bg-white border rounded shadow-md z-10">
                            <div
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                onClick={() => {
                                    setFilterRange('all');
                                    setDropdownOpen(false);
                                }}
                            >
                                All
                            </div>
                            <div
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                onClick={() => {
                                    setFilterRange('0-4');
                                    setDropdownOpen(false);
                                }}
                            >
                                0 - 4
                            </div>
                            <div
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                onClick={() => {
                                    setFilterRange('4-7');
                                    setDropdownOpen(false);
                                }}
                            >
                                4 - 7
                            </div>
                            <div
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                onClick={() => {
                                    setFilterRange('7-10');
                                    setDropdownOpen(false);
                                }}
                            >
                                7 - 10
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Candidate List */}
            {filteredCandidates?.map((candidate, index) => (
                <div
                    key={index}
                    className="p-5 flex gap-3 items-center justify-between bg-white rounded-lg mb-3"
                >
                    <div className="flex items-center gap-5">
                        <h2 className="bg-primary p-3 px-4.5 font-bold text-white rounded-full">
                            {candidate.userName[0]}
                        </h2>
                        <div>
                            <h2 className="font-bold">{candidate?.userName}</h2>
                            <h2 className="text-sm text-gray-500">
                                Completed On:{' '}
                                {moment(candidate?.created_at).format('MMM DD, yyyy')}
                            </h2>
                        </div>
                    </div>
                    <div className="flex gap-3 items-center">
                        <h2 className="font-bold text-green-500">
                            {candidate?.feedback?.feedback?.rating?.totalRating}/10
                        </h2>
                        <CandidateFeedbackDialog candidate={candidate} />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CandidatesList;

