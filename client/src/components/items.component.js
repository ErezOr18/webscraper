import React, { Component } from 'react';
// eslint-disable-next-line
import { Link } from 'react-router-dom';
import axios from 'axios';


import { trackPromise } from 'react-promise-tracker';


const Item = props => (
    <tr>
        <td>{props.item.name}</td>
        <td>{props.item.price}</td>
        <td>{props.item.color}</td>
        <td>{props.item.sizes}</td>
        <td>
            <a href={props.item.itemURL} target="_blank">item link</a>
        </td>
        <td>
            <button className="btn btn-danger" onClick={() => { props.deleteitem(props.item._id) }}>delete item</button>
        </td>
    </tr>
)

export default class itemsList extends Component {
    constructor(props) {
        super(props);


        this.onChangeItemUrl = this.onChangeItemUrl.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.deleteitem = this.deleteitem.bind(this);

        this.state = {
            Items: [],
            itemURL: ''
        };
    }

    componentDidMount() {
        trackPromise(
            axios.get('http://localhost:5000/items/')
                .then(response => {
                    this.setState({ Items: response.data })
                })
                .catch((error) => {
                    console.log(error);
                })

        );
    }


    itemList() {
        return this.state.Items.map(currentitem => {
            return <Item item={currentitem} deleteitem={this.deleteitem} key={currentitem._id} />;
        })
    }


    onChangeItemUrl(e) {
        this.setState({
            itemURL: e.target.value
        })
    }

    onSubmit(e) {
        e.preventDefault();

        const itemURL = {
            itemURL: this.state.itemURL
        }

        console.log(itemURL);
        trackPromise(
            axios.post('http://localhost:5000/items', itemURL)
                .then(res => {
                    this.componentDidMount();
                })
        );
        this.setState({
            itemURL: ''
        })
    }

    deleteitem(id) {
        axios.delete('http://localhost:5000/items/' + id)
            .then(res => {
                this.setState({
                    Items: this.state.Items.filter(el => el._id !== id)
                });
            });
    }

    onRefresh(e) {
        e.preventDefault();

        trackPromise(
            axios.get('http://localhost:5000/refresh/')
                .then(response => {
                    this.setState({ Items: response.data });
                })
                .catch((error) => {
                    console.log(error);
                })
        );
    }


    render() {
        return (
            <div className = "containr-fluid">
                <h3>Items</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>new Item url: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.itemURL}
                            onChange={this.onChangeItemUrl}
                        />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Add item" className="btn btn-primary" />
                    </div>
                </form>

                <button className="btn btn-danger" onClick={this.onRefresh}>
                    refresh data
                </button>
                <table className="table table-dark table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>color</th>
                            <th>sizes</th>
                            <th>item URL</th>
                            <th>delete item</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.itemList()}
                    </tbody>
                </table>
            </div>
        )
    }
}