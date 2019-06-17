import React, {Component} from 'react';

import SectionSpaceCard from './Components/SectionDetailCard/SectionSpaceCard';
import SectionPriceCard from './Components/SectionDetailCard/SectionPriceCard';
import SectionDetailCard from './Components/SectionDetailCard/SectionDetailCard';
import Exception from '@/components/Exception/index';

export default class SectionDetails extends Component {
    constructor(props) {
        super(props);
    }


    componentWillMount() {
        if (!this.props.location.query.id) {
            let redictId = window.localStorage.getItem("RoadResourceId");
            window.localStorage.removeItem("RoadResourceId");
            window.location.hash = `${location.hash}/SectionDetails?id=${redictId}`;
        }
    }

    componentDidMount() {

    }


    render() {
        //判断页面权限
        if (!window.checkPageEnable("sectionDetail")) {
            return <Exception type={403}/>
        }

        return (
            <div>
                <div className="page">
                    <div className="page-header">路段详情</div>
                    {this.props.location.query.id ?
                        <div className='page-content' style={{padding: 0, background: 'transparent'}}>
                            <SectionDetailCard id="SectionDetailCard" parkId={this.props.location.query.id}/>
                            <SectionPriceCard id="SectionPriceCard" parkId={this.props.location.query.id}/>
                            <SectionSpaceCard id='SectionSpaceCard' parkId={this.props.location.query.id}/>
                        </div> : <div className='page-content' style={{padding: 0, background: 'transparent'}}>
                        </div>}
                </div>
            </div>
        )
    }
}
