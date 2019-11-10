# ams

Attendance managing system.

## Structure

### Tables

lessonTime:

1  08.30-09.15

2  09.20-10.05

3  10.25-11.10

4  11.15-12.00

5  13.30-14.15

6  14.20-15.05

7  15.25-16.10

8  16.15-17.00

9  17.05-17.50

10 18.30-19.15 (Use as nighty self-study)

11 19.20-20.05

12 20.10-20.55

### key-name rules

TableName:keyName:ID

## Database layers

### Layer 1 Connection

The layer is record to string key-valve pairs realized by keyv.

### Layer 2 Database

The layer is the layer which support table-like operation based on ID.

### Layer 3 Table

This layer need to convert all kinds of values into string in order to communicate with layer 2.
