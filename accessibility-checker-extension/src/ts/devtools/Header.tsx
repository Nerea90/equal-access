/******************************************************************************
     Copyright:: 2020- IBM, Inc

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
  *****************************************************************************/

import React from "react";

import {
    MultiSelect, Button
} from 'carbon-components-react';

import { Reset16 } from '@carbon/icons-react';
// import { SettingsAdjust16 } from '@carbon/icons-react';
import { ReportData16 } from '@carbon/icons-react';

const BeeLogo = "/assets/Bee_logo.svg";
import Violation16 from "../../assets/Violation16.svg";
import NeedsReview16 from "../../assets/NeedsReview16.svg";
import Recommendation16 from "../../assets/Recommendation16.svg";

interface IHeaderState {}

interface IHeaderProps {
    layout: "main" | "sub",
    startScan: () => void,
    collapseAll: () => void,
    reportHandler: () => void,
    showIssueTypeCallback: (type:string) => void
    showIssueTypeMenuCallback: (type:string[]) => void
    counts?: {
        "total": { [key: string]: number },
        "filtered": { [key: string]: number }
    } | null,
    dataFromParent: boolean[],
    scanning: boolean
}



export default class Header extends React.Component<IHeaderProps, IHeaderState> {
    state: IHeaderState = {};

    processSelectedIssueTypes (items:any) {
        let newItems = ["", "", ""];
        items.map((item:any) => {
            if (item.id === "Violations") {
                newItems[0] = "Violations";
            } else if (item.id === "NeedsReview") {
                newItems[1] = "NeedsReview";
            } else if (item.id === "Recommendations") {
                newItems[2] = "Recommendations";
            }
        })
        if (items.length == 0) {
            this.props.showIssueTypeMenuCallback(["Violations", "NeedsReview", "Recommendations"]);
        }
        if (items.length > 0) {
            this.props.showIssueTypeMenuCallback([newItems[0], newItems[1], newItems[2]]);
        }
    }
        
    sendShowIssueTypeData(type:string) {
        this.props.showIssueTypeCallback(type);
    }

    render() {
        let counts = this.props.counts;
        let noScan = counts ? true : false;

        const items = [
            {
                id: 'Violations',
                label: 'Show Violations'
            },
            {
                id: 'NeedsReview',
                label: 'Show Needs Review'
            },
            {
                id: 'Recommendations',
                label: 'Show Recommendations'
            }
        ]

        if (this.props.scanning == true) {
            noScan = true;
        }


        if (!counts) {
            counts = {
                "total": {},
                "filtered": {}
            }
        }
        counts.total["Violation"] = counts.total["Violation"] || 0;
        counts.total["Needs review"] = counts.total["Needs review"] || 0;
        counts.total["Recommendation"] = counts.total["Recommendation"] || 0;
        counts.total["All"] = counts.total["Violation"] + counts.total["Needs review"] + counts.total["Recommendation"];

        counts.filtered["Violation"] = counts.filtered["Violation"] || 0;
        counts.filtered["Needs review"] = counts.filtered["Needs review"] || 0;
        counts.filtered["Recommendation"] = counts.filtered["Recommendation"] || 0;
        counts.filtered["All"] = counts.filtered["Violation"] + counts.filtered["Needs review"] + counts.filtered["Recommendation"];

        let bDiff = counts.total["Violation"] !== counts.filtered["Violation"]
            || counts.total["Needs review"] !== counts.filtered["Needs review"]
            || counts.total["Recommendation"] !== counts.filtered["Recommendation"];

        let headerContent = (<div className="bx--grid">
            <div className="bx--row" style={{ lineHeight: "1rem" }}>
                <div className="bx--col-sm-3">
                    <h1>IBM Equal Access Accessibility Checker</h1>
                </div>
                <div className="bx--col-sm-1" style={{ position: "relative" }}>
                    <img className="bee-logo" src={BeeLogo} alt="IBM Accessibility" />
                </div>
            </div>
            <div className="bx--row" style={{ marginTop: '10px' }}>
                <div className="bx--col-sm-2">
                    <Button onClick={this.props.startScan.bind(this)} size="small" className="scan-button">Scan</Button>
                </div>
                <div className="bx--col-sm-2" style={{ position: "relative" }}>
                    <div style={{display:"flex", justifyContent:"center"}}>
                    
                    <div style={{width:250}}>
                    <MultiSelect
                            items={items}
                            onChange={(value) => this.processSelectedIssueTypes(value.selectedItems)}
                            direction="bottom"
                            disabled={false}
                            id="Filter issues"
                            initialSelectedItems={[items[0], items[1], items[2]]}
                            invalidText="Invalid Selection"
                            label="Filter issues"
                            light={false}
                            locale="en"
                            open={false}
                            selectionFeedback="top-after-reopen"
                            size="sm"
                            type="default"
                        />
                        </div>
                        <Button
                            disabled={!this.props.counts}
                            onClick={this.props.collapseAll}
                            className="settingsButtons" size="small" hasIconOnly kind="ghost" iconDescription="Reset selections" type="button"
                        >
                            <Reset16 className="my-custom-class" />
                        </Button>
                        <Button
                            disabled={!this.props.counts}
                            onClick={this.props.reportHandler}
                            className="settingsButtons" size="small" hasIconOnly kind="ghost" iconDescription="Report" type="button"
                        >
                            <ReportData16 className="my-custom-class" />
                        </Button>
                    
                    </div>
                </div>
            </div>

            <div className="bx--row summary" role="region" arial-label='Issue count' style={{marginTop:"14px"}}>
                <div className="bx--col-sm-1" style={{paddingBottom:"0"}}>
                    <img src={Violation16} alt="Violations" />
                    <Button kind="ghost" 
                            className="summaryBarViolationButton"
                            onClick={() => this.sendShowIssueTypeData("Violations")}
                            style={this.props.dataFromParent[0] || this.props.dataFromParent[1] ? {fontWeight: 600} : {fontWeight: 400}}
                            aria-pressed = {this.props.dataFromParent[1]}
                            aria-label= "Show only violations">
                            {noScan ? ((bDiff ? counts.filtered["Violation"] + "/" : "") + counts.total["Violation"]) : " "} Violations
                    </Button>
                </div>
                <div className="bx--col-sm-1">
                    <img src={NeedsReview16} alt="Needs review" />
                    <Button kind="ghost" 
                            className="summaryBarNeedsReviewButton"
                            onClick={() => this.sendShowIssueTypeData("NeedsReview")}
                            style={this.props.dataFromParent[0] || this.props.dataFromParent[2] ? {fontWeight: 600} : {fontWeight: 400}}
                            aria-pressed = {this.props.dataFromParent[2]}
                            aria-label= "Show only needs review">
                            {noScan ? ((bDiff ? counts.filtered["Needs review"] + "/" : "") + counts.total["Needs review"]) : " "} Needs review
                    </Button>
                </div>
                <div className="bx--col-sm-1">
                    <img src={Recommendation16} alt="Recommendation" />
                    <Button kind="ghost" 
                        className="summaryBarRecommendationButton"
                        onClick={() => this.sendShowIssueTypeData("Recommendations")}
                        style={this.props.dataFromParent[0] || this.props.dataFromParent[3] ? {fontWeight: 600} : {fontWeight: 400}}
                        aria-pressed = {this.props.dataFromParent[3]}
                        aria-label= "Show only needs recommendations">
                        {noScan ? ((bDiff ? counts.filtered["Recommendation"] + "/" : "") + counts.total["Recommendation"]) : " "} Recommendations
                    </Button>
                </div>
                <div className="bx--col-sm-1" role="status">
                    {/* <span className="summaryBarCounts" style={{ fontWeight: 400 }}>{noScan ? ((bDiff ? counts.filtered["All"] + "/" : "") + counts.total["All"]) : " "}&nbsp;Issues&nbsp;{(bDiff ? "selected" : "found")}</span> */}
                    <span className="summaryBarCounts" style={{ fontWeight: 400 }}>{!noScan ? "Not Scanned" : (this.props.scanning ? "Scanning...": ((bDiff ? counts.filtered["All"] + "/" : "") + counts.total["All"] + " Issues " + (bDiff ? "selected" : "found")))}</span>
                </div>
            </div>
        </div>);

        if (this.props.layout === "main") {
            return <div className="fixed-header"
                style={{ zIndex: 1000, backgroundColor: "rgba(255, 255, 255, 1)", left: "50%", width: "50%" }}>
                {headerContent}
            </div>
        } else {
            return <div className="fixed-header" style={{ zIndex: 1000, backgroundColor: "rgba(255, 255, 255, 1)" }}>
                {headerContent}
            </div>
        }
    }
}