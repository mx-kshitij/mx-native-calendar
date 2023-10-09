import { useEffect, ReactElement, createElement } from "react";
// import { useMemo } from "react";
import { View } from "react-native";
// import { mergeNativeStyles } from "@mendix/pluggable-widgets-tools";
import { CustomStyle } from "../MxNativeCalendar";
import { ValueStatus, ActionValue, ListValue, ListAttributeValue, EditableValue, ListExpressionValue } from "mendix";
import { Calendar, DateData } from "react-native-calendars";
import { formatDate } from "./Utils";

export interface SimpleCalendarProps {
    selectedDate: EditableValue<Date> | undefined;
    selectedDateColor: string | undefined;
    onDateChange?: ActionValue | undefined;
    events?: ListValue | undefined;
    eventDate?: ListAttributeValue<Date> | undefined;
    eventDateColor?: ListExpressionValue<string> | undefined;
    maxEventsDots?: number;
    style?: CustomStyle;
}

const currentDate = new Date();
let selectedDateValue: string, eventDates: any[], currentDateColor: string, finalMarkedDate: any;

export function SimpleCalendar({
    selectedDate,
    selectedDateColor,
    onDateChange,
    events,
    eventDate,
    eventDateColor,
    maxEventsDots
}: SimpleCalendarProps): ReactElement {
    // selectedDateValue = selectedDateValue ? selectedDateValue : formatDate(currentDate);
    // const [selectedDateValue, setSelectedDateValue] = useState<string>(formatDate(currentDate));
    // const [eventDates, setEventDates] = useState<any[]>();
    // const eventDates = useMemo(() => {
    //     if (events !== undefined && events.items !== undefined && eventDate !== undefined) {
    //         const dataToReturn: object[] = [];

    //         events.items.forEach(item => {
    //             const objToPush: any = {};
    //             const eventDateValue = eventDate.get(item).value;
    //             const eventColor = eventDateColor ? eventDateColor.get(item).value : "blue";
    //             objToPush[formatDate(eventDateValue)] = {
    //                 dots: [{ marked: true, selectedColor: eventColor, color: eventColor }]
    //             };
    //             dataToReturn.push(objToPush);
    //         });

    //         return dataToReturn;
    //     }
    // }, [events]);
    // const currentDateColor = useRef("Blue");

    const initialize = () => {
        if (selectedDate === undefined || selectedDate.status !== ValueStatus.Available) {
            selectedDateValue = formatDate(currentDate);
        } else {
            selectedDateValue = formatDate(selectedDate.value);
        }
        if (selectedDateColor !== undefined) {
            currentDateColor = selectedDateColor;
        }
    };

    useEffect(() => {
        initialize();
    }, []);

    useEffect(() => {
        if (events !== undefined && events.items !== undefined && eventDate !== undefined) {
            const dataToReturn: object[] = [];

            events.items.forEach(item => {
                const objToPush: any = {};
                const eventDateValue = eventDate.get(item).value;
                const eventColor = eventDateColor ? eventDateColor.get(item).value : "blue";
                objToPush[formatDate(eventDateValue)] = {
                    dots: [{ marked: true, selectedColor: eventColor, color: eventColor }]
                };
                dataToReturn.push(objToPush);
            });

            eventDates = dataToReturn;
        }
        finalMarkedDate = getDatesToRender();
    }, [events, selectedDate]);

    const getDatesToRender = () => {
        let markedDates: any = {};
        if (eventDates) {
            markedDates = eventDates.reduce((result: { [x: string]: any }, item: { [x: string]: any }) => {
                const key = Object.keys(item)[0];
                if (result[key] !== undefined) {
                    if (result[key].dots === undefined) {
                        result[key].dots = [];
                    }
                    result[key].dots =
                        result[key].dots.length < (maxEventsDots ? maxEventsDots : 5)
                            ? result[key].dots.concat(item[key].dots)
                            : result[key].dots;
                } else {
                    result[key] = item[key];
                }
                return result;
            }, {});
        }
        if (selectedDateValue === undefined) {
            initialize();
        }
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
                    selectedDateValue = day.dateString;
                    selectedDate?.setValue(new Date(day.dateString));
                    onDateChange?.execute();
                }}
                markedDates={finalMarkedDate}
                enableSwipeMonths
            />
        </View>
    );
}
