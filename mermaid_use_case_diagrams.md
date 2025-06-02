### Student Use Cases

```mermaid
useCaseDiagram
    actor Student

    Student --> (Register for an account)
    Student --> (Log in / Log out)
    Student --> (Complete/Update Profile)
    Student --> (View email verification status)

    Student --> (View Course Catalog / Public Course Listings)
    Student --> (Enroll in Course)
    Student --> (View Enrolled Courses Dashboard)
    Student --> (Access Course Content)
    Student --> (Download Course Attachments)

    Student --> (View Course Announcements)
    Student --> (Comment on Announcements)
    Student --> (Participate in Course Discussions)
    Student --> (Create new discussion threads)
    Student --> (Post replies to threads)

    Student --> (View Assignments)
    Student --> (Submit Assignment)
    Student --> (Take Quizzes)
    Student --> (View Grades and Feedback)
    Student --> (Track overall course progress)
```

### Instructor Use Cases

```mermaid
useCaseDiagram
    actor Instructor

    Instructor --> (Register for an account)
    Instructor --> (Log in / Log out)
    Instructor --> (Complete/Update Profile with Instructor Details)

    Instructor --> (Create New Course)
    Instructor --> (Edit Existing Course Details)
    Instructor --> (Manage Course Status - Draft, Publish, Archive)
    Instructor --> (Add/Edit/Delete/Reorder Course Chapters)
    Instructor --> (Add/Edit/Delete/Reorder Course Resources)
    
    Instructor --> (View Enrolled Students)
    Instructor --> (Manage Student Enrollment Status)
    Instructor --> (Generate/View Course Invite Codes and Links)

    Instructor --> (Create New Assignment)
    Instructor --> (Edit/Delete Assignments)
    Instructor --> (Publish/Unpublish Assignments)
    Instructor --> (View Student Submissions)
    Instructor --> (Grade Submissions)
    
    Instructor --> (Create New Quiz)
    Instructor --> (Add/Edit/Delete Quiz Questions and Options)
    Instructor --> (Manage Quiz settings)

    Instructor --> (Post Course Announcements)
    Instructor --> (Edit/Delete Announcements)
    Instructor --> (View/Manage Comments on Announcements)
    Instructor --> (Moderate Course Discussions)

    Instructor --> (View Instructor Dashboard and Analytics)
```

### Administrator Use Cases

```mermaid
useCaseDiagram
    actor Administrator

    Administrator --> (Log in / Log out)

    Administrator --> (Manage Homepage Content)
    Administrator --> (Manage About Page Content)
    Administrator --> (Manage Contact Page Content)
    Administrator --> (Manage Publications / Site-wide Announcements)

    Administrator --> (Manage User Accounts - Potential)
    Administrator --> (Manage Course Categories - Potential)
    Administrator --> (Configure System-wide Settings - Potential)
    Administrator --> (View System Health/Logs - Potential)
```
