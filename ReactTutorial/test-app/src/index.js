import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

import CanvasJSReact from './assets/canvasjs.react';
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const call = require('./call.js');


//random helper
//ref: https://stackoverflow.com/questions/21131224/sorting-json-object-based-on-attribute
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        const x = a[key];
        const y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function CategoryChart(props) {
    let result = [];
    let searchCriteria = props.state.criteria;
    searchCriteria = searchCriteria.filter(criteria => criteria !== 'keyword');

    for(let criteria of searchCriteria){
        let dataPoints = props.state[`${criteria}`].options;
        dataPoints = sortByKey(dataPoints, 'count');
        dataPoints = dataPoints.reverse();
        let topNine = dataPoints.slice(0,9);
        let other = dataPoints.slice(9).map(entry => entry.count);
        other = other.reduce((acc, val) => acc+val);

        dataPoints = topNine.map(d => { return { label: d.name, y: d.count}});
        dataPoints.push({label: 'Other', y: other});

        const options = {
            title: {
                text: `${criteria.charAt(0).toUpperCase() + criteria.slice(1)} Statistics`
            },
            theme: 'dark2',
            width: 500,
            height: 300,
            data: [{
                type: "doughnut",
                dataPoints: dataPoints
            }]
        };

        result.push(options);
    }

    result = result.map(r => <CanvasJSChart options = {r}/>);
    result = result.map(r => <div className="stats">{r}</div>);

    return (
        <div className={"testing"}>
            <h2>{(result.length > 0) ? 'API Statistics' : ''}</h2>
            {result}
        </div>
    );
}

function CriteriaSelector(props){
    return(
        <label>
            <b>Search Criteria:</b>
            <br/>
            <br/>
            <input type="checkbox" value="keyword" onChange={props.onCriteriaSelection} />
            <label htmlFor="keyword">Keyword</label>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <input type="checkbox" value="technique" onChange={props.onCriteriaSelection}/>
            <label htmlFor="technique">Technique</label>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <input type="checkbox" value="century" onChange={props.onCriteriaSelection}/>
            <label htmlFor="century">Century</label>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <input type="checkbox" value="culture" onChange={props.onCriteriaSelection}/>
            <label htmlFor="culture">Culture</label>
            <br/>
            <br/>
        </label>
    );
}

function KeywordInput(props){
    if (!props.criteria.includes('keyword')) {
        return (<div/>);
    } else {
        return (
            <div className="formInput">
                <label>
                    Keyword:&nbsp;&nbsp;
                    <input type="text" onChange={props.onKeywordChange}/>
                </label>
            </div>
        );
    }
}

function TechniqueSelector(props){
    if(!props.criteria.includes('technique')){
        return null;
    } else {
        let techniques = props.options;
        techniques = sortByKey(techniques, 'name');
        techniques = techniques.map(c => <option key={c.name} value={c.name}>{c.name}</option>);
        return(
            <div className="formInput">
                <label>
                    Technique:&nbsp;&nbsp;
                    <select onChange={(i) => props.onTechniqueChange(i)}>
                        {techniques}
                    </select>
                </label>
            </div>
        );
    }
}

function CenturySelector(props){
    if(!props.criteria.includes('century')){
        return null;
    } else {
        let centuries = props.options;
        centuries = sortByKey(centuries, 'name');
        centuries = centuries.map(c => <option key={c.name} value={c.name}>{c.name}</option>);
        return(
            <div className="formInput">
                <label>
                    Century:&nbsp;&nbsp;
                    <select onChange={(i) => props.onCenturyChange(i)}>
                        {centuries}
                    </select>
                </label>
            </div>
        );
    }
}

function CultureSelector(props){
    if(!props.criteria.includes('culture')){
        return null;
    } else {
        let cultures = props.options;
        cultures = sortByKey(cultures, 'name');
        cultures = cultures.map(c => <option key={c.name} value={c.name}>{c.name}</option>);
        return(
            <div className="formInput">
                <label>
                    Culture:&nbsp;&nbsp;
                    <select onChange={(i) => props.onCultureChange(i)}>
                        {cultures}
                    </select>
                </label>
            </div>
        );
    }
}

class Explorer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            criteria: [],
            keyword: null,
            technique: {
                selected: null
            },
            century: {
                selected: null,
                options: null
            },
            culture: {
                selected: null,
                options: null
            },
            results: null
        }
    }

    onKeywordChange(i){
        this.setState({
            keyword: i.target.value
        });
    }

    onTechniqueChange(i){
        this.setState({
            technique:{
                selected: i.target.value,
                options: this.state.technique.options
            }
        });
    }
    async fetchTechniques(){
        if(!this.state.technique.options) {
            const choices = await call.getSection('technique');
            this.setState({
                technique: {
                    selected: choices.records[0].name,
                    options: choices.records
                }
            });
        }
    }

    onCenturyChange(i){
        this.setState({
            century: {
                selected: i.target.value,
                options: this.state.century.options
            }
        });
    }

    async fetchCenturies(){
        if(!this.state.century.options) {
            const choices = await call.getSection('century');
            this.setState({
                century: {
                    selected: choices.records[0].name,
                    options: choices.records
                }
            });
        }
    }

    onCultureChange(i){
        this.setState({
            culture: {
                selected: i.target.value,
                options: this.state.culture.options
            }
        })
    }

    async fetchCultures(){
        if(!this.state.culture.options) {
            let choices = await call.getSection('culture');
            this.setState({
                culture: {
                    selected: choices.records[0].name,
                    options: choices.records
                }
            });
        }
    }

    async onCriteriaSelection(i){

        let selectedCriteria = this.state.criteria;
        if (!selectedCriteria.includes(i.target.value)) {
            selectedCriteria.push(i.target.value);
        } else{
            selectedCriteria.splice(selectedCriteria.indexOf(i.target.value),1)
        }

        if(!selectedCriteria.includes('keyword')){
            this.state.keyword = null;
        }

        if(selectedCriteria.includes('technique')){
            await this.fetchTechniques();
        } else {
            this.state.technique.selected = null;
        }

        if(selectedCriteria.includes('century')){
            await this.fetchCenturies();
        } else {
            this.state.century.selected = null;

        }

        if(selectedCriteria.includes('culture')){
            await this.fetchCultures();
        } else {
            this.state.culture.selected = null;

        }

        this.setState({
            criteria: selectedCriteria
        })

    }

    async fetchResults(){
        this.setState({
            results: await call.search(this.state)
        });
    }

    renderResults(){
        if(this.state.results !== null){

            let title = (this.state.results.title) ?
                (this.state.results.title) : 'Unknown Title';
            let people = (this.state.results.people && this.state.results.people.length > 0) ?
                this.state.results.people.map(p => <li key={p.name}>{p.name} ({p.role})</li>) : null;
            let technique = (this.state.results.technique) ?
                (this.state.results.technique) : 'Unknown Technique';
            let century = (this.state.results.century) ?
                (this.state.results.century) : 'Unknown Century';
            let culture = (this.state.results.culture) ?
                (this.state.results.culture) : 'Unknown Culture';
            let image = (this.state.results.image) ?
                (<img src={this.state.results.image} alt={"search result"}/>) : 'Image not Available';


            return(
                <div className="result">
                    <h3><u>Search Results</u></h3>
                    <p><b>Title: </b> {title}</p>
                    <p><b>People: </b></p>
                    {(people) ? <ul>{people}</ul> : 'Unknown'}
                    <p><b>Technique: </b> {technique}</p>
                    <p><b>Century: </b> {century}</p>
                    <p><b>Culture: </b> {culture}</p>
                    <p><b>Image: </b></p>
                    {image}
                </div>
            );
        } else {
            return(
                <div className="result">
                    <h3><u>Search Results</u></h3>
                    <p>There are no results to display, use the search button to search for results.</p>
                </div>
            );
        }

    }

    render()  {
        return (
            <div>
                <h1>Harvard Art Museums API</h1>

                <br/>

                <h2>Search for Images</h2>
                <CriteriaSelector
                    onCriteriaSelection={(i) => this.onCriteriaSelection(i)}
                />

                <KeywordInput
                    criteria={this.state.criteria}
                    onKeywordChange={(i) => this.onKeywordChange(i)}
                />

                <TechniqueSelector
                    criteria={this.state.criteria}
                    options={this.state.technique.options}
                    onTechniqueChange={(i) => this.onTechniqueChange(i)}
                />

                <CenturySelector
                    criteria={this.state.criteria}
                    options={this.state.century.options}
                    onCenturyChange={(i) => this.onCenturyChange(i)}
                />

                <CultureSelector
                    criteria={this.state.criteria}
                    options={this.state.culture.options}
                    onCultureChange={(i) => this.onCultureChange(i)}
                />

                <div className="button">
                    <br/>
                    <button className="search" onClick={() => this.fetchResults()}>
                        Search
                    </button>
                </div>

                <br/>
                <br/>

                <div>
                    {this.renderResults()}
                </div>

                <br/>

                <CategoryChart
                    state={this.state}
                />
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Explorer />,
    document.getElementById('root')
);
