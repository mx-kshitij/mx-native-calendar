/**
 * This file was generated from MxNativeCalendar.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ActionValue, DynamicValue, EditableValue, ListValue, ListAttributeValue, ListExpressionValue } from "mendix";

export interface MxNativeCalendarProps<Style> {
    name: string;
    style: Style[];
    selectedDate: EditableValue<Date>;
    selectedDateColor: DynamicValue<string>;
    onDateChange?: ActionValue;
    events?: ListValue;
    eventDate?: ListAttributeValue<Date>;
    eventDateColor?: ListExpressionValue<string>;
    maxEventsDots: number;
}

export interface MxNativeCalendarPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    selectedDate: string;
    selectedDateColor: string;
    onDateChange: {} | null;
    events: {} | { caption: string } | { type: string } | null;
    eventDate: string;
    eventDateColor: string;
    maxEventsDots: number | null;
}
