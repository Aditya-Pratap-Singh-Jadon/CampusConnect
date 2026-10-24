# CampusConnect MongoDB Shell demonstration

These examples target the `campusconnect` database and the sample records in `Backend/seed-data/campusconnect-seed.json`. They have **not** been run against a database. Connect with `mongosh` as described in [database setup](database-setup.md); the connection URI must select `campusconnect`. Mongoose names the collections `users`, `posts`, `applications`, and `connections`.

Run each numbered command **inside `mongosh`**. Results shown below are illustrative, not actual output.

## 1. Confirm database and collections

```javascript
({ database: db.getName(), collections: db.getCollectionNames() })
```

Shows the selected database and available collections. Illustrative result: `{ database: 'campusconnect', collections: ['users', 'posts', 'applications', 'connections'] }`.

## 2. Display students

```javascript
db.users.find({ role: 'student' }, { name: 1, year: 1, branch: 1, skills: 1, _id: 0 }).limit(3)
```

Shows three student profiles. Illustrative result: a document for Aarav Demo with `year: 2` and `skills: ['React', 'JavaScript', 'CSS']`.

## 3. Find a named student

```javascript
db.users.findOne({ name: 'Meera Demo', role: 'student' }, { name: 1, domain: 1, skills: 1, _id: 0 })
```

Finds Meera's profile. Illustrative result: `{ name: 'Meera Demo', domain: 'Backend', skills: ['Node.js', 'MongoDB', 'Express'] }`.

## 4. Search technical skills

```javascript
db.users.find({ role: 'student', skills: { $in: ['React', 'MongoDB'] } }, { name: 1, skills: 1, _id: 0 })
```

Finds students with either skill. Illustrative result: Aarav Demo and Meera Demo among others.

## 5. Find available mentors

```javascript
db.users.find({ role: 'alumni', alumniAvailability: { $in: ['open', 'limited'] } }, { name: 1, domain: 1, alumniAvailability: 1, achievements: 1, _id: 0 })
```

Uses the existing alumni role and availability fields for mentor discovery. Illustrative result: Nisha Mentor Demo is `open`; Rohan Mentor Demo is `limited`.

## 6. Query open opportunities

```javascript
db.posts.find({ status: 'open' }, { title: 1, category: 1, skillsNeeded: 1, teamSize: 1, creator: 1, _id: 0 })
```

Shows collaboration and hackathon posts with their required skills. Illustrative result: `Accessible Campus Events App` needs `Node.js` and `MongoDB`.

## 7. Match a hackathon skill requirement

```javascript
db.users.find({ role: 'student', skills: { $all: ['Node.js', 'MongoDB'] } }, { name: 1, year: 1, skills: 1, _id: 0 })
```

Finds students who have both skills needed by the Civic Tech post. Illustrative result: Meera Demo and Sana Demo.

## 8. Sort and limit students

```javascript
db.users.find({ role: 'student' }, { name: 1, year: 1, _id: 0 }).sort({ year: -1, name: 1 }).limit(3)
```

Shows the three highest academic years first. Illustrative result: Ishaan Demo (`year: 4`) before third year students.

## 9. Count students by academic year

```javascript
db.users.aggregate([{ $match: { role: 'student' } }, { $group: { _id: '$year', students: { $sum: 1 } } }, { $sort: { _id: 1 } }])
```

Groups students by the numeric `year` field. Illustrative result: `{ _id: 2, students: 2 }`.

## 10. Join applications to posts and applicants

```javascript
db.applications.aggregate([{ $lookup: { from: 'posts', localField: 'post', foreignField: '_id', as: 'postDetails' } }, { $lookup: { from: 'users', localField: 'applicant', foreignField: '_id', as: 'applicantDetails' } }, { $project: { status: 1, postTitle: { $first: '$postDetails.title' }, applicantName: { $first: '$applicantDetails.name' } } }])
```

Resolves `Application.post` and `Application.applicant` ObjectId references explicitly; `mongosh` does not populate them automatically. Illustrative result: an `accepted` application from Meera Demo to `Accessible Campus Events App`.
