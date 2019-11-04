# ams

Attendance manage system.

## Structure

### Tables

- student: stuID, name

- reason: reaID, name

- abscence: absID, stuID, reaID, dateFrom, dateTo, lesson, img

- outDatedAbscence: (extends from abscence)

### Report

- abscence: {{status, count, reason}, ...}

### Trasaction

- kickOutDatedAbscence: abscence -> outDatedAbscence

- addAbscence: -> abscence

- editAbscence: -> abscence

- deleteAbscence: -> abscence

### key-name rules

TableName:keyName:ID
