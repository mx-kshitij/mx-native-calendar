import { ReactElement, createElement } from "react";
import { StyleSheet, View, TextStyle, ViewStyle } from "react-native";
// import { Style } from "@mendix/pluggable-widgets-tools";
import { MxNativeCalendarProps } from "../typings/MxNativeCalendarProps";
import { ValueStatus } from "mendix";
import { MxCalendar } from "./components/MxCalendar";
import { all } from "deepmerge";
import { formatDate } from "./components/Utils";

// export interface CustomStyle extends Style {
export interface CustomStyle extends ViewStyle {
    container: ViewStyle;
    label: TextStyle;
}

let currentDateColor: string,
    currentDateTextColor: string,
    minimumDate: string,
    maximumDate: string,
    disabledDatesValues: string[] | undefined;

export function MxNativeCalendar({
    selectedDate,
    selectedDateColor,
    selectedDateTextColor,
    minDate,
    maxDate,
    disabledDates,
    disabledDateAttribute,
    events,
    eventDate,
    eventDateColor,
    maxEventsDots,
    style,
    name
}: MxNativeCalendarProps<CustomStyle>): ReactElement {
    if (
        selectedDate === undefined ||
        selectedDate.status !== ValueStatus.Available ||
        (events !== undefined && events.status === ValueStatus.Loading) ||
        (selectedDateColor !== undefined && selectedDateColor.status === ValueStatus.Loading) ||
        (selectedDateTextColor !== undefined && selectedDateTextColor.status === ValueStatus.Loading) ||
        (minDate !== undefined && minDate.status === ValueStatus.Loading) ||
        (maxDate !== undefined && maxDate.status === ValueStatus.Loading) ||
        (disabledDates !== undefined && disabledDates.status === ValueStatus.Loading)
    ) {
        return <View></View>;
    } else {
        const customStyles = style.filter(o => o != null);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const mergedStyles = all<ViewStyle>([defaultStyle, ...customStyles]);

        currentDateColor = selectedDateColor?.value !== undefined ? selectedDateColor.value : "#146ef6";
        currentDateTextColor = selectedDateTextColor?.value !== undefined ? selectedDateTextColor.value : "#FFF";
        minimumDate = minDate?.value ? formatDate(minDate?.value) : "1970-01-01";
        maximumDate = maxDate?.value ? formatDate(maxDate?.value) : "9999-12-31";
        if (disabledDates?.items && disabledDateAttribute) {
            disabledDatesValues = disabledDates?.items?.map(item => {
                return formatDate(disabledDateAttribute?.get(item).value);
            });
        } else {
            disabledDatesValues = [];
        }
        console.trace(`Disabled dates : ${JSON.stringify(disabledDatesValues)}`);

        return (
            <MxCalendar
                selectedDate={selectedDate}
                selectedDateColor={currentDateColor}
                selectedDateTextColor={currentDateTextColor}
                minDate={minimumDate}
                maxDate={maximumDate}
                disabledDates={disabledDatesValues}
                events={events}
                eventDate={eventDate}
                eventDateColor={eventDateColor}
                maxEventsDots={maxEventsDots}
                style={mergedStyles}
                name={name}
            />
        );
    }
}

const defaultStyle = StyleSheet.create({
    calendar: {
        marginBottom: 10
    },
    switchContainer: {
        flexDirection: "row",
        margin: 10,
        alignItems: "center"
    },
    switchText: {
        margin: 10,
        fontSize: 16
    },
    text: {
        textAlign: "center",
        padding: 10,
        backgroundColor: "lightgrey",
        fontSize: 16
    },
    disabledText: {
        color: "grey"
    },
    defaultText: {
        color: "purple"
    },
    customCalendar: {
        height: 250,
        borderBottomWidth: 1,
        borderBottomColor: "lightgrey"
    },
    customDay: {
        textAlign: "center"
    },
    customHeader: {
        backgroundColor: "#FCC",
        flexDirection: "row",
        justifyContent: "space-around",
        marginHorizontal: -4,
        padding: 8
    },
    customTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10
    },
    customTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#00BBF2"
    }
});
