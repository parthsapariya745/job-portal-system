import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FindJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async (search = '') => {
        try {
            const { data } = await axios.get(`/api/v1/jobs`, {
                params: { limit: 50, ...(search && { keyword: search }) }
            });
            setJobs(Array.isArray(data?.jobs) ? data.jobs : []);
        } catch (error) {
            console.error(error);
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs(keyword);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Next Job</h1>
                <form onSubmit={handleSearch} className="flex gap-4 max-w-2xl">
                    <input 
                        type="text" 
                        placeholder="Search by job title or keyword..." 
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="flex-1 rounded-md border-0 py-3 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium">
                        Search
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="grid gap-6">
                    {Array.isArray(jobs) && jobs.length > 0 ? (
                        jobs.map((job) => (
                            <div key={job._id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-600">{job.title}</h3>
                                        <p className="text-gray-900 font-medium mt-1">{job.company?.name || job.companyName || 'Company'}</p>
                                        <p className="text-gray-500 text-sm flex gap-4 mt-2">
                                            <span>📍 {job.location || 'N/A'}</span>
                                            <span>💼 {job.type || 'N/A'}</span>
                                            <span>💰 {job.salary?.min && job.salary?.max ? `${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}${job.salary.salaryType === 'Per Month' ? ' / month' : ' LPA'}` : typeof job.salary === 'object' ? 'Not disclosed' : job.salary || 'Not disclosed'}</span>
                                        </p>
                                    </div>
                                    <Link to={`/jobs/${job._id}`} className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 text-sm font-medium">
                                        View Details
                                    </Link>
                                </div>
                                <div className="mt-4">
                                    <p className="text-gray-600 line-clamp-2">{job.description}</p>
                                </div>
                                <div className="mt-4 text-xs text-gray-400">
                                    Posted {new Date(job.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No jobs found matching your criteria.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default FindJobs;
