import { useState, useEffect, ReactElement, createElement } from "react";
import { View, TextStyle, ViewStyle } from "react-native";
import { Style } from "@mendix/pluggable-widgets-tools";
import { MxNativeCalendarProps } from "../typings/MxNativeCalendarProps";
import { Calendar, DateData } from "react-native-calendars";
import { ValueStatus, Option } from "mendix";

export interface CustomStyle extends Style {
    container: ViewStyle;
    label: TextStyle;
}

const formatDate = (inputDate: Date | Option<Date>): string => {
    if (inputDate === undefined) {
        inputDate = new Date();
    }
    let month = (inputDate.getMonth() + 1).toString();
    month = month.length === 1 ? "0" + month : month;
    let date = inputDate.getDate().toString();
    date = date.length === 1 ? "0" + date : date;
    return inputDate.getFullYear() + "-" + month + "-" + date;
};

export function MxNativeCalendar({
    selectedDate,
    selectedDateColor,
    onDateChange,
    events,
    eventDate,
    eventDateColor,
    maxEventsDots
}: MxNativeCalendarProps<CustomStyle>): ReactElement {
    const [selectedDateValue, setSelectedDateValue] = useState<string>(formatDate(new Date()));
    const [eventDates, setEventDates] = useState<any>();
    const [currentDateColor, setCurrenDateColor] = useState("Blue");

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (selectedDate === undefined || selectedDate.status !== ValueStatus.Available) {
            setSelectedDateValue(formatDate(new Date()));
        } else {
            setSelectedDateValue(formatDate(selectedDate.value));
        }
        if (selectedDateColor !== undefined && selectedDateColor.status === ValueStatus.Available) {
            setCurrenDateColor(selectedDateColor.value.toString());
        }
    }, [selectedDate, selectedDateColor]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (events !== undefined && events.items !== undefined && eventDate !== undefined) {
            const dataToReturn: any[] = [];

            events.items.forEach(item => {
                const objToPush: any = {};
                const eventDateValue = eventDate.get(item).value;
                const eventColor = eventDateColor ? eventDateColor.get(item).value : "blue";
                objToPush[formatDate(eventDateValue)] = {
                    dots: [{ marked: true, selectedColor: eventColor, color: eventColor }]
                };
                dataToReturn.push(objToPush);
            });

            setEventDates(dataToReturn);
        }
    }, [eventDate, eventDateColor, events]);

    if (
        selectedDate === undefined ||
        selectedDate.status !== ValueStatus.Available ||
        (events !== undefined && events.status === ValueStatus.Loading) ||
        (selectedDateColor !== undefined && selectedDateColor.status === ValueStatus.Loading)
    ) {
        return <View></View>;
    }

    const getDatesToRender = (): any => {
        const datesToRender = eventDates ? [...eventDates] : [];
        // datesToRender.push({ [selectedDateValue]: { selected: true, selectedColor: currentDateColor, dots: [] } });
        const markedDates = datesToRender.reduce((result: { [x: string]: any }, item: { [x: string]: any }) => {
            const key = Object.keys(item)[0];
            if (result[key] !== undefined) {
                if (result[key].dots === undefined) {
                    result[key].dots = [];
                }
                result[key].dots =
                    result[key].dots.length < maxEventsDots
                        ? result[key].dots.concat(item[key].dots)
                        : result[key].dots;
            } else {
                result[key] = item[key];
            }
            return result;
        }, {});
        if (markedDates[selectedDateValue] === undefined) {
            markedDates[selectedDateValue] = {};
        }
        markedDates[selectedDateValue].selected = true;
        markedDates[selectedDateValue].selectedColor = currentDateColor;
        return markedDates;
    };

    return (
        <View>
            <Calendar
                // Customize the appearance of the calendar
                style={{
                    borderWidth: 1,
                    borderColor: "gray",
                    height: 350
                }}
                markingType={"multi-dot"}
                // Specify the current date
                current={selectedDateValue}
                // Callback that gets called when the user selects a day
                onDayPress={(day: DateData) => {
                    setSelectedDateValue(day.dateString);
                    selectedDate.setValue(new Date(day.dateString));
                    onDateChange?.execute();
                }}
                markedDates={getDatesToRender()}
            />
        </View>
    );
}
