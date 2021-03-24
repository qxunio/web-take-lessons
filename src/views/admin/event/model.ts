export class EventModel {
    public id?: string;
    public name?: string;
    public canUpdate?:string
    public num?: string;
    public schoolYear?: [string];
    public tagIds?:[string]
    public stime?: string;
    public etime?: string;
    public status?: string;
    public enable?: string;
    public ctime?: string;
    public utime?: string;
    public creator?: string;
}

export class TeacherModel {
    public id?: string;
    public name?: string;
    public account?: string;
    public tag?: string;
}

export class ConfigurationSubjectModel {
    public id?: string;
    public eventId?: string;
    public subjectId?: string;
    public className?: string;
    public subjectName?: string;
    public num?: string;
    public teachAddress?: string;
    public teachTime?: string;
    public teachers?: ConfigurationTeacherModel[]
}


export class ConfigurationTeacherModel {
    public id?: string;
    public eventId?: string;
    public csId?: string;
    public teacherId?: string;
    public teacherName?: string;
    public teacherAccount?: string;
    public ctime?: string;
}


export class ConfigurationSubjectSimpleModel {
    public id?: string;
    public subjectId?: string;
    public subjectName?: string;
    public introduction?: string;
    public teachAddress?: string;
    public teachTime?: string;
    public teacher?: string;
    public remainingPlaces?: string
    public num?: string
}
