import MaterialTable from "material-table";
import React from 'react';
import tableIcons from '../../../assets/js/MateralTableIcons';
const GrowthOfShareTable = ({ data }) => {
    const columns = [
        { title: "Year", field: "year", sorting: true, filtering: true, filterPlaceholder: "Filter by year", align: 'center' },
        { title: "Share Price", field: "iniShare", filtering: false, sorting: false, align: 'center' },
        { title: "Shares", field: "iniPrice", filtering: false, sorting: false, align: 'center' },
        {
            title: "Annual Dividends Earned", field: "growthRate", sorting: false, align: 'center', filtering: false,
        },
        {
            title: "Total Dividends Earned ", field: "divYeild", sorting: false, filtering: false, align: 'center'
        },

    ];

    return (
        <div style={{
            marginTop: '30px', width: 800, marginRight: 'auto', marginLeft: 'auto', fontWeight: 500
        }}>
            <MaterialTable title="Growth of Shares with DRIP" icons={tableIcons} columns={columns} data={data}
                options={{

                    sorting: true, search: true,
                    searchFieldAlignment: "right", searchAutoFocus: true, searchFieldVariant: "standard",
                    filtering: true, paging: true, pageSizeOptions: [2, 5, 10, 20], pageSize: 5,
                    paginationType: "normal", showFirstLastPageButtons: true, paginationPosition: "bottom", exportButton: false,
                    exportAllData: true, exportFileName: "TableData", addRowPosition: "first", actionsColumnIndex: -1, selection: false,
                    showSelectAllCheckbox: false, showTextRowsSelected: false,
                    columnsButton: false,
                    rowStyle: {
                        fontSize: 16,
                    }

                }}
                localization={{
                    header: {
                        actions: 'action',

                    }
                }}


            />
        </div>
    );
};

export default GrowthOfShareTable;