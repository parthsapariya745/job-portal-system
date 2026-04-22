const http = require('http');

const makeRequest = (queryParams) => {
    return new Promise((resolve, reject) => {
        const url = `http://localhost:5000/api/v1/jobs${queryParams}`;
        console.log(`Requesting: ${url}`);
        
        http.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve(parsed);
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
};

const runTests = async () => {
    try {
        console.log('--- Starting Job Search Verification ---');

        // Test 1: Get All Jobs
        console.log('\nTest 1: Get All Jobs');
        const allJobs = await makeRequest('');
        console.log(`Total Jobs Found: ${allJobs.total || 0}`);
        if(allJobs.status === 'success') console.log('✅ Success');
        else console.log('❌ Failed');

        // Test 2: Min Salary 50000
        console.log('\nTest 2: Min Salary 50k');
        const salaryJobs = await makeRequest('?minSalary=50000');
        console.log(`Jobs Found: ${salaryJobs.total || 0}`);
        // Log titles to verify
        if (salaryJobs.jobs) {
            salaryJobs.jobs.forEach(j => console.log(` - ${j.title} (Max Salary: ${j.salary?.max})`));
        }

        // Test 3: Experience 'entry'
        console.log('\nTest 3: Experience Entry Level');
        const entryJobs = await makeRequest('?experience=entry');
        console.log(`Jobs Found: ${entryJobs.total || 0}`);
         if (entryJobs.jobs) {
            entryJobs.jobs.forEach(j => console.log(` - ${j.title} (Level: ${j.level})`));
        }

        // Test 4: Job Type 'Full-time'
        console.log('\nTest 4: Job Type Full-time');
        const typeJobs = await makeRequest('?type=Full-time');
        console.log(`Jobs Found: ${typeJobs.total || 0}`);
         if (typeJobs.jobs) {
            typeJobs.jobs.forEach(j => console.log(` - ${j.title} (Type: ${j.type})`));
        }
        
    } catch (error) {
        console.error('Test Failed:', error.message);
    }
};

runTests();
