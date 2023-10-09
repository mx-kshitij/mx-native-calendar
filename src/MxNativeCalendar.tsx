import { ReactElement, createElement } from "react";
import { View, TextStyle, ViewStyle } from "react-native";
import { Style } from "@mendix/pluggable-widgets-tools";
import { MxNativeCalendarProps } from "../typings/MxNativeCalendarProps";
import { SimpleCalendar } from "./components/SimpleCalendar";
import { ValueStatus } from "mendix";

export interface CustomStyle extends Style {
    container: ViewStyle;
    label: TextStyle;
}

export function MxNativeCalendar({
    selectedDate,
    selectedDateColor,
    onDateChange,
    events,
    eventDate,
    eventDateColor,
    maxEventsDots,
    // style,
    name
}: MxNativeCalendarProps<CustomStyle>): ReactElement {
    if (
        selectedDate === undefined ||
        selectedDate.status !== ValueStatus.Available ||
        (events !== undefined && events.status === ValueStatus.Loading) ||
        (selectedDateColor !== undefined && selectedDateColor.status === ValueStatus.Loading)
    ) {
        return <View></View>;
    } else {
        const selectedDateColorValue = selectedDateColor ? selectedDateColor.value : "Blue";

        return (
            <SimpleCalendar
                selectedDate={selectedDate}
                selectedDateColor={selectedDateColorValue}
                eventDate={eventDate}
                events={events}
                eventDateColor={eventDateColor}
                maxEventsDots={maxEventsDots}
                onDateChange={onDateChange}
                key={name}
            />
        );
    }
}
