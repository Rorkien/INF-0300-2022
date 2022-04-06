import { Button, Checkbox, InputGroup, NumericInput } from "@blueprintjs/core";
import { useEffect, useState } from "react";
import { Activity } from "../types";

interface ActivityComponentProps {
  activity: Activity,
  activityChanged: (activity: Activity) => void,
  activityRemoved: (activity: Activity) => void,
}

export function ActivityComponent(props: ActivityComponentProps) {
  const [activity, setActivity] = useState<Activity>(props.activity);

  useEffect(() => {
    props.activityChanged(activity);
  }, [activity.optimisticValue, activity.mostProbableValue, activity.pessimisticValue, activity.criticalPath]);

  const criticalPathChangeHandler = () => {
    setActivity({ ...activity, criticalPath: !activity.criticalPath });
  };

  return (
    <div style={{ paddingTop: "4px" }}>
      <div style={{ display: "inline-flex" }}>
        <InputGroup
          style={{ width: "100px", marginTop: "4px" }}
          id="text-input"
          value={activity.identifier}
          onChange={e => setActivity({ ...activity, identifier: e.target.value })}
          placeholder="Nome da atividade" />

        <NumericInput
          style={{ width: "80px", marginTop: "4px", marginLeft: "8px" }}
          value={activity.optimisticValue}
          buttonPosition={"none"}
          selectAllOnFocus={true}
          onValueChange={e => {
            setActivity({ ...activity, optimisticValue: e });
          }} />

        <NumericInput
          style={{ width: "80px", marginTop: "4px", marginLeft: "8px" }}
          value={activity.mostProbableValue}
          buttonPosition={"none"}
          selectAllOnFocus={true}
          onValueChange={e => {
            setActivity({ ...activity, mostProbableValue: e });
          }} />

        <NumericInput
          style={{ width: "80px", marginTop: "4px", marginLeft: "8px" }}
          value={activity.pessimisticValue}
          buttonPosition={"none"}
          selectAllOnFocus={true}
          onValueChange={e => {
            setActivity({ ...activity, pessimisticValue: e });
          }} />

        <Checkbox style={{ margin: "10px" }} checked={activity.criticalPath} label="Caminho crítico?" onChange={() => criticalPathChangeHandler()} />

        <Button style={{ margin: "4px" }} icon="remove" intent="danger" onClick={() => props.activityRemoved(props.activity)}/>
      </div>
    </div>
  );
}