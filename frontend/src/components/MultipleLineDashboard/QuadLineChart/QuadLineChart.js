
import { Axis, Grid, LineSeries, Tooltip, XYChart } from '@visx/xychart';
import { format, formatISO, parse, parseISO } from 'date-fns';
import './QuadLineChart.css';

const chartConfig = {
    xScale: { type: 'band' },
    yScale: { type: 'linear' },
    margin: { top: 50, right: 10, bottom: 50, left: 50 },
};

const labelXOffset = 50;
const labelYOffset = 50;


const QuadLineChart = ({ width, height, stockData, tickerSeries }) => {

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
                label='Time'
            />
            <Axis
                orientation='left'
                numTicks={10}

                label='Stock Price'
            />

            <LineSeries
                dataKey='line1'
                data={stockData}
                xAccessor={(d) => formatISO(parse(d.x, 'MM/dd/yyyy', new Date()))}
                yAccessor={(d) => d.y1}
                stroke="green"
            />
            <LineSeries
                dataKey='line2'
                data={stockData}
                xAccessor={(d) => formatISO(parse(d.x, 'MM/dd/yyyy', new Date()))}
                yAccessor={(d) => d.y2}
                stroke="red"
            />
            <LineSeries
                dataKey='line3'
                data={stockData}
                xAccessor={(d) => formatISO(parse(d.x, 'MM/dd/yyyy', new Date()))}
                yAccessor={(d) => d.y3}
                stroke="blue"
            />
            <LineSeries
                dataKey='line4'
                data={stockData}
                xAccessor={(d) => formatISO(parse(d.x, 'MM/dd/yyyy', new Date()))}
                yAccessor={(d) => d.y4}
                stroke="violet"
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
                renderTooltip={({ tooltipData, colorScale }) => (
                    <div style={{ background: '' }}>
                        <br />
                        <div style={{ color: 'black' }}><b>Date: </b>
                            {format(
                                parse(
                                    tooltipData?.nearestDatum?.datum.x,
                                    'MM/dd/yyyy',
                                    new Date()
                                ),
                                'do MMM yyyy'
                            )}
                        </div>
                        <br />
                        <div className='tooltip-wrapper'>
                            <div class="green-circle">
                            </div>
                            <div className='tooltip-text-wrapper'>
                                <div>
                                    <span>Ticker : </span>
                                    <span>{tickerSeries[1]}</span>
                                </div>
                                <div>
                                    <span>Investment value : </span>
                                    <span>{tooltipData?.nearestDatum?.datum.y1.toFixed(2)} $</span>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div className='tooltip-wrapper'>
                            <div class="red-circle">
                            </div>
                            <div className='tooltip-text-wrapper'>
                                <div>
                                    <span>Ticker : </span>
                                    <span>{tickerSeries[2]}</span>
                                </div>
                                <div>
                                    <span>Investment value : </span>
                                    <span>{tooltipData?.nearestDatum?.datum.y2.toFixed(2)} $</span>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div className='tooltip-wrapper'>
                            <div class="blue-circle">
                            </div>
                            <div className='tooltip-text-wrapper'>
                                <div>
                                    <span>Ticker : </span>
                                    <span>{tickerSeries[3]}</span>
                                </div>
                                <div>
                                    <span>Investment value : </span>
                                    <span>{tooltipData?.nearestDatum?.datum.y3.toFixed(2)} $</span>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div className='tooltip-wrapper'>
                            <div class="violet-circle">
                            </div>
                            <div className='tooltip-text-wrapper'>
                                <div>
                                    <span>Ticker : </span>
                                    <span>{tickerSeries[4]}</span>
                                </div>
                                <div>
                                    <span>Investment value : </span>
                                    <span>{tooltipData?.nearestDatum?.datum.y4.toFixed(2)} $</span>
                                </div>
                            </div>
                        </div>
                        <br />
                    </div>
                )
                }
            />
            {/* {stockPrices
      .filter((d) => !!d.events)
      .map((datum, i) => (
        <Annotation
          key={i}
          dataKey='line' // use this Series's accessor functions, alternatively specify x/yAccessor here
          datum={datum}
          dx={i % 2 === 0 ? labelXOffset : -labelXOffset}
          dy={i % 2 === 0 ? labelYOffset * 5 : -labelYOffset}
        >
          <AnnotationLabel
            title={format(
              parse(datum.x, 'MM/dd/yyyy', new Date()),
              'do MMM yyyy'
            )}
            subtitle={datum.events!.join(', ')}
            showAnchorLine={false}
            backgroundFill='rgba(0,150,150,0.1)'
          />
          <AnnotationConnector />
        </Annotation>
      ))} */}
        </XYChart>
    );
};

export default QuadLineChart;

