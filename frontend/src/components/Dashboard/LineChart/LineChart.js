
import { Axis, Grid, LineSeries, Tooltip, XYChart } from '@visx/xychart';
import { format, formatISO, parse, parseISO } from 'date-fns';
import './LineChart.css';

const chartConfig = {
    xScale: { type: 'band' },
    yScale: { type: 'linear' },
    margin: { top: 50, right: 10, bottom: 50, left: 50 },
};

const labelXOffset = 50;
const labelYOffset = 50;


const LineChart = ({ width, height, stockData }) => {

    return (
        <XYChart
            {...chartConfig}
            width={width}
            height={height}

        >
            <Grid numTicks={10} />

            <Axis
                orientation='bottom'
                numTicks={10}
                tickFormat={(v) => format(parseISO(v), ' MMM yyyy')}
                label='Date'
            />
            <Axis
                orientation='left'
                numTicks={10}

                label='Stock Price ($)'
            />

            <LineSeries
                dataKey='line1'
                data={stockData}
                xAccessor={(d) => formatISO(parse(d.x, 'MM/dd/yyyy', new Date()))}
                yAccessor={(d) => d.y}
                stroke="#6873FA"

            />

            <Tooltip
                snapTooltipToDatumX
                snapTooltipToDatumY
                showVerticalCrosshair
                showSeriesGlyphs
                glyphStyle={{
                    fill: "#008561",
                    strokeWidth: 0.5
                }}
                renderTooltip={({ tooltipData }) => (
                    <div >
                        <br />
                        <div style={{ color: 'black' }}>
                            {format(
                                parse(
                                    tooltipData?.nearestDatum?.datum.x,
                                    'MM/dd/yyyy',
                                    new Date()
                                ),
                                'MMM dd, yyyy'
                            )}
                        </div>
                        <br />
                        <div className='tooltip-wrapper'>
                            <div class="unknown-circle">
                            </div>
                            <div className='tooltip-text-wrapper'>
                                <div style={{ color: 'black' }}><b>Price: </b> ${tooltipData?.nearestDatum?.datum.y.toFixed(2)}</div>
                                <br />
                                <div>
                                    <b><span style={{ color: 'black' }}>Total Return:</span> </b>
                                    ${stockData.map((datum, i) => {
                                        if (i === tooltipData?.nearestDatum?.index) {
                                            if (datum.return !== undefined) return `${datum.return} ( ${datum.change}% )`;
                                        }
                                    })}
                                </div>
                            </div>
                        </div>
                        <br />
                    </div>
                )
                }
            />

        </XYChart>
    );
};

export default LineChart;

