## ERD
```mermaid
erDiagram
    account ||--o{ account_school_relation: "has"
    school ||--o{ account_school_relation: "has"
    account ||--o{ practice: "has"
    practice ||--o{ annotation: "has"
    account_school_relation ||--o| account_role: "has"
    account_role ||--o{ role: "has"
    annotation ||--o{ task: "has"

    account {
        varchar id PK 
        varchar name 
        varchar email 
        varchar passwordHash 
        timeStamp createdAt 
        timeStamp updatedAt 
    }

    account_school_relation {
        varchar id PK
        varchar accountId FK
        varchar schoolId FK
        timeStamp createdAt 
        timeStamp updatedAt 
    }

    account_role {
        varchar id PK
        varchar accountSchoolRelationId FK
        varchar roleId FK
        timeStamp createdAt 
        timeStamp updatedAt
    }

    role {
        varchar id PK
        varchar name 
        timeStamp createdAt 
        timeStamp updatedAt 
    }

    school {
        varchar id PK
        varchar name 
        varchar address 
        varchar phoneNumber 
        timeStamp createdAt 
        timeStamp updatedAt 
    }

    practice {
        varchar id PK
        varchar accountId FK
        varchar musicId FK
        timeStamp createdAt 
        timeStamp updatedAt
    }
    
    annotation {
        varchar id PK
        varchar practiceId FK
        text content
        varchar taskId FK "nullable"
        int sectionNumber
        int timePosition
        int positionX
        int positionY
        timeStamp createdAt 
        timeStamp updatedAt
    }
```