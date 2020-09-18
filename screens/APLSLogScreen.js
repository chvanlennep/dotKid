import React, { useState, createContext, Children } from 'react';

//Pending need to use State and context to pass between components on buttons and the log
// also to reset and undo


const APLSLogScreen = () => {
    const LogContext = createContext({
        log: [],
        logEvent: () => {},
      });
    const [log, setLog] = useState([])
    const logEvent = () => setLog(log => [...log, children])

    return (
        <View>
            <LogContext.Provider
            value={{
                log,
                logEvent,
            }} />
        </View>
    )
}

export default APLSLogScreen
