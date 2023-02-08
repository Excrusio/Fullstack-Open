const Header = ({ course }) => {
    return <h1>{course.name}</h1>;
};

const Part = (props) => {
    return (
        <p>
            {props.name} {props.exercises}
        </p>
    );
};

const Content = ({ course }) => {
    return (
        <div>
            {course.parts.map((part) => (
                <Part key={part.id} name={part.name} exercises={part.exercises} />
            ))}
        </div>
    );
};

const Total = ({ course }) => {
    const total = course.parts.reduce((accumulator, currentValue) => accumulator + currentValue.exercises, 0);
    return (
        <p>
            <b>Total Number of exercises {total}</b>
        </p>
    );
};

const Course = ({ course }) => {
    return (
        <>
            <Header course={course} />
            <Content course={course} />
            <Total course={course} />
        </>
    );
};

export default Course;
