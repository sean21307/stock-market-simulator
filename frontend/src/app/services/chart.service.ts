import { Injectable } from '@angular/core';
import { AgCharts } from 'ag-charts-angular';
import { AgCartesianSeriesTooltipRendererParams, AgChartOptions, AgLineSeriesTooltipRendererParams } from 'ag-charts-types';

function renderer({
  datum,
  xKey,
  yKey,
  yName,
}: AgLineSeriesTooltipRendererParams) {
  return {
    data: [
      {
        label: datum[xKey],
        value: '$' + datum[yKey].toFixed(2),
      },
    ],
  };
}

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  getChartOptions(data: any, darkMode: boolean): AgChartOptions {
    return {
      data: data,

      series: [
        {
          type: 'line',
          xKey: 'day',
          yKey: 'price',
          connectMissingData: true,
          marker: {
            enabled: false,
          },
          tooltip: { renderer: renderer },
          //stroke: this.darkMode && "#208a09" || "#2196f3"
        }
      ],
      
      axes: [
        {
          type: 'category',
          position: 'bottom',
          label: {
            color: darkMode ? '#B8BBC1' : '#000000',
          },
          line: {
            stroke: darkMode ? '#3B3D3F' : '#E0EAF1',
          }
        },
        {
          type: 'number',
          position: 'left',
          label: {
            color: darkMode ? '#B8BBC1' : '#000000',
          },
          gridLine: {
            style: [
              {
                  stroke: darkMode ? '#3B3D3F' : '#C3C3C3',
              },
              ],
          },
        }
      ],
      background: {
        fill: "transparent",
      },
    };
  }

  constructor() { }
}
