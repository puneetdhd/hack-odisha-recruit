import moment from 'moment';
import React, { useState } from 'react'
import CandidateFeedbackDialog from './CandidateFeedbackDialog';
import useDebounce from '@/hooks/useDebounce';

function CandidatesList({ candidateList = [] }) {
    const [filterRange, setFilterRange] = useState('all');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 400);

    const filteredCandidates = candidateList.filter(candidate => {
        const rating = candidate?.feedback?.feedback?.rating?.totalRating ?? 0;
        // Add debounced search filter (by name)
        const matchesSearch = candidate?.userName?.toLowerCase().includes(debouncedSearch.toLowerCase());
        let rangeMatch = true;
        switch (filterRange) {
            case '0-3':
                rangeMatch = rating >= 0 && rating <= 3;
                break;
            case '4-6':
                rangeMatch = rating >= 3 && rating <= 6;
                break;
            case '7-10':
                rangeMatch = rating >= 6 && rating <= 10;
                break;
            default:
                rangeMatch = true;
        }
        return matchesSearch && rangeMatch;
    });

    return (
        <div>
            {/* Header and Filter */}
            <div className="flex justify-between items-center my-5">
                <h2 className='font-bold'>Candidates ({filteredCandidates.length})</h2>
                <input
                    type="text"
                    placeholder="Search candidates..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="border rounded px-2 py-1"
                />
                {/* ...existing filter dropdown... */}
            </div>
            {filteredCandidates?.map((candidate, index) => (
                <div key={index} className="p-5 flex gap-3 items-center justify-between bg-white rounded-lg">
                    <div className='flex items-center gap-5'>
                        <h2 className="bg-primary p-3 px-4.5 font-bold text-white rounded-full">{candidate.userName[0]}</h2>
                        <div>
                            <h2 className='font-bold'>{candidate?.userName}</h2>
                            <h2 className='text-sm text-gray-500'>
                                Completed On: {moment(candidate?.created_at).format('MMM DD, yyyy')}
                            </h2>
                        </div>
                    </div>
                    <div className='flex gap-3 items-center'>
                        <h2 className='font-bold text-green-500'>
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
