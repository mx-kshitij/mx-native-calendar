import { ReactElement, createElement } from "react";
import { useState, useCallback, useMemo } from "react";
import { View, ViewStyle } from "react-native";
// import { mergeNativeStyles } from "@mendix/pluggable-widgets-tools";
// import { CustomStyle } from "../MxNativeCalendar";
import { ValueStatus, ListValue, ListAttributeValue, EditableValue, ListExpressionValue } from "mendix";
import { Calendar } from "react-native-calendars";
import { formatDate } from "./Utils";
import Icon from "react-native-vector-icons/FontAwesome";

const currentDate = new Date();
let selectedDateValue: string;

export interface MxCalendarProps {
    selectedDate: EditableValue<Date> | undefined;
    selectedDateColor: string | undefined;
    selectedDateTextColor: string | undefined;
    minDate: string | undefined;
    maxDate: string | undefined;
    disabledDates?: string[] | undefined;
    events?: ListValue | undefined;
    eventDate?: ListAttributeValue<Date> | undefined;
    eventDateColor?: ListExpressionValue<string> | undefined;
    maxEventsDots?: number;
    style?: ViewStyle;
    name?: string;
}

export function MxCalendar({
    selectedDate,
    selectedDateColor,
    selectedDateTextColor,
    minDate,
    maxDate,
    disabledDates,
    events,
    eventDate,
    eventDateColor,
    maxEventsDots,
    style,
    name
}: MxCalendarProps): ReactElement {
    const [finalMarkedDate, setFinalMarkedDate] = useState<any>({});

    //Set the selected value for initial load
    const initialize = () => {
        if (selectedDate === undefined || selectedDate.status !== ValueStatus.Available) {
            selectedDateValue = formatDate(currentDate);
        } else {
            selectedDateValue = formatDate(selectedDate.value);
        }
        setFinalMarkedDate(selectedDateValue);
    };

    //Executed on new date is selected
    const onDayPressFn = useCallback((day: { dateString: any }) => {
        setFinalMarkedDate(day.dateString);
        selectedDateValue = day.dateString;
        selectedDate?.setValue(new Date(day.dateString));
    }, []);

    //Return marked dates to the Calendar element
    const marked = useMemo(() => {
        initialize();
        const eventDates = getEventDates();
        let retVal: any = {};
        if (eventDates) {
            //If there are events
            if (eventDates[finalMarkedDate]) {
                //If the selected date is already part of the event dates returned
                eventDates[finalMarkedDate].selected = true;
                eventDates[finalMarkedDate].selectedColor = selectedDateColor;
                eventDates[finalMarkedDate].selectedTextColor = selectedDateTextColor;
                retVal = eventDates;
            } else {
                //If selected date is not part of the event dates
                retVal = {
                    [finalMarkedDate]: {
                        selected: true,
                        disableTouchEvent: true,
                        selectedColor: selectedDateColor,
                        selectedTextColor: selectedDateTextColor
                    },
                    ...eventDates
                };
            }
        } else {
            //If no events
            retVal = {
                [finalMarkedDate]: {
                    selected: true,
                    disableTouchEvent: true,
                    selectedColor: selectedDateColor,
                    selectedTextColor: selectedDateTextColor
                }
            };
        }
        //If there are any disabled dates
        if (disabledDates) {
            disabledDates.forEach(item => {
                if (retVal[item]) {
                    retVal[item].disabled = true;
                } else {
                    retVal = {
                        [item]: {
                            disabled: true,
                            disableTouchEvent: true
                        },
                        ...retVal
                    };
                }
            });
        }
        console.trace(`Displayed marked dates : ${JSON.stringify(retVal)}`);
        console.trace(`Min/Max dates : ${minDate}, ${maxDate}`);
        return retVal;
    }, [finalMarkedDate, events]);

    //Get the dates from events & marked dots
    function getEventDates() {
        const datesToReturn: any = {};
        //If events list is not empty
        if (events && events.items && events?.items?.length > 0) {
            events.items?.forEach(item => {
                const dateString: string = formatDate(eventDate?.get(item).value);
                const eventColorString = eventDateColor?.get(item).value;
                //If date is already part of datesToReturn
                if (datesToReturn[dateString]) {
                    if (!maxEventsDots || (maxEventsDots && datesToReturn[dateString].dots.length < maxEventsDots)) {
                        datesToReturn[dateString].dots.push({
                            marked: true,
                            selectedColor: eventColorString,
                            color: eventColorString
                        });
                    }
                } else {
                    datesToReturn[dateString] = {
                        dots: [{ marked: true, selectedColor: eventColorString, color: eventColorString }]
                    };
                }
            });
        }
        return datesToReturn;
    }

    //Return Calendar element with all configured items
    return (
        <View>
            <Calendar
                // Customize the appearance of the calendar
                style={style}
                markingType={"multi-dot"}
                // Specify the current date
                current={selectedDateValue}
                // Callback that gets called when the user selects a day
                onDayPress={onDayPressFn}
                //Dates marked to be shown on the calendar
                markedDates={marked}
                minDate={minDate}
                maxDate={maxDate}
                disableAllTouchEventsForDisabledDays
                disableAllTouchEventsForInactiveDays
                enableSwipeMonths
                testID={name}
                hideArrows={false}
                renderArrow={direction => {
                    if (direction === "left") {
                        return <Icon name="chevron-left" />;
                    } else {
                        return <Icon name="chevron-right" />;
                    }
                }}
            />
        </View>
    );
}
