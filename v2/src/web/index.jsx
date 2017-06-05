class MyComponent extends React.Component {
    render() {
        let style = {color: "red", "font-weight": 700};
        return (
            <div style={style}>Hello Evan</div>
        );
    }
}

ReactDOM.render(<MyComponent />, document.getElementById('content'));