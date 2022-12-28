
import React from 'react';
import {
    Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis,
    YAxis
} from "recharts";
import './InvestmentGrowthChart.css';
const CustomTooltip = ({ active, payload, label }) => {
    console.log(payload);
    if (active && payload && payload.length) {
        console.log(payload);
        return (
            <div className='rechart-tooltip'>


                <div className='rechart-tooltip-wrapper'>
                    <div class="lightGreen-circle">
                    </div>
                    <div className='rechart-tooltip-text-wrapper'>
                        <div>
                            <span className="text-title"> Category : </span>
                            <span> Total Return </span>
                        </div>
                        <div>
                            <span className="text-title"> Year : </span>
                            <span> {` ${payload[2].payload.year}`} </span>
                        </div>
                        <div>
                            <span className="text-title"> Value : </span>
                            <span> {` ${payload[2].payload.return}`} </span>
                        </div>
                    </div>
                </div>

                <div className='rechart-tooltip-wrapper'>
                    <div class="red-circle">
                    </div>
                    <div className='rechart-tooltip-text-wrapper'>
                        <div>
                            <span className="text-title"> Category : </span>
                            <span> Total Contribution </span>
                        </div>
                        <div>
                            <span className="text-title"> Year : </span>
                            <span> {` ${payload[1].payload.year}`} </span>
                        </div>
                        <div>
                            <span className="text-title"> Value : </span>
                            <span> {` ${payload[2].payload.tContrib}`} </span>
                        </div>
                    </div>
                </div>

                <div className='rechart-tooltip-wrapper'>
                    <div class="blue-circle">
                    </div>
                    <div className='rechart-tooltip-text-wrapper'>
                        <div>
                            <span className="text-title"> Category : </span>
                            <span> Initial Investment </span>
                        </div>
                        <div>
                            <span className="text-title"> Year : </span>
                            <span> {` ${payload[2].payload.year}`} </span>
                        </div>
                        <div>
                            <span className="text-title"> Value : </span>
                            <span> {` ${payload[2].payload.investment}`} </span>
                        </div>
                    </div>
                </div>

            </div>


        );
    }

    return null;
};


const InvestmentGrowthChart = ({ data }) => {
    return (





        <BarChart
            width={1100}
            height={600}
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend layout="vetical" verticalAlign="middle" align="right" style={{ right: '-150px' }} />
            <Bar name='Initial Investment' dataKey="investment" stackId="a" fill="blue" />
            <Bar name="Total Contribution" dataKey="tContrib" stackId="a" fill="red" />
            <Bar name='Total Return' dataKey="return" stackId="a" fill="lightgreen" />
            {/* <Bar name="test" dataKey="uv" stackId="a" fill="#fcf" /> */}
        </BarChart>


    );
};

export default InvestmentGrowthChart;