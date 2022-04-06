import "./App.css";

import { Activity, Project } from "./components/types";
import { useEffect, useState } from "react";
import { ActivityComponent } from "./components/Activity/Activity";
import { Button } from "@blueprintjs/core";

function App() {
  const [activities, setActivities] = useState<Activity[]>([
    { key: 0, identifier: "Atividade 1", optimisticValue: 0, mostProbableValue: 0, pessimisticValue: 0, criticalPath: true },
    { key: 1, identifier: "Atividade 2", optimisticValue: 0, mostProbableValue: 0, pessimisticValue: 0, criticalPath: true },
    { key: 2, identifier: "Atividade 3", optimisticValue: 0, mostProbableValue: 0, pessimisticValue: 0, criticalPath: true },
  ]);
  const [project, setProject] = useState<Project>({});

  const valueChanged = (activity: Activity) => {
    const estimatedDuration = (activity.optimisticValue + (4 * activity.mostProbableValue) + activity.pessimisticValue) / 6;
    const standardError = (activity.pessimisticValue - activity.optimisticValue) / 6;

    activity.estimatedDuration = estimatedDuration;
    activity.standardError = standardError;
    activity.variance = standardError ** 2;
    activity.firstGauss = [estimatedDuration - standardError, estimatedDuration + standardError];
    activity.secondGauss = [estimatedDuration - (standardError * 2), estimatedDuration + (standardError * 2)];
    activity.thirdGauss = [estimatedDuration - (standardError * 3), estimatedDuration + (standardError * 3)];

    const newActivities = [...activities.filter(a => a.key !== activity.key), activity]
      .sort((a, b) => a.key - b.key);
    setActivities(newActivities);
  };

  useEffect(() => {
    const projectEstimatedDuration = activities.filter(a => a.criticalPath).map(a => a.estimatedDuration).reduce((p, c) => (p ?? 0) + (c ?? 0), 0) ?? 0;
    const projectVariance = activities.filter(a => a.criticalPath).map(a => a.variance).reduce((p, c) => (p ?? 0) + (c ?? 0), 0) ?? 0;
    const projectStandardError = Math.sqrt(projectVariance ?? 0);

    setProject({
      estimatedDuration: projectEstimatedDuration,
      standardError: projectStandardError,
      variance: projectVariance,
      firstGauss: [projectEstimatedDuration - projectStandardError, projectEstimatedDuration + projectStandardError],
      secondGauss: [projectEstimatedDuration - (projectStandardError * 2), projectEstimatedDuration + (projectStandardError * 2)],
      thirdGauss: [projectEstimatedDuration - (projectStandardError * 3), projectEstimatedDuration + (projectStandardError * 2)],
    });
  }, [activities]);

  const addActivity = () => {
    const nextKey = (Math.max(-1, ...activities.map(a => a.key))) + 1;
    const newActivity: Activity = {
      key: nextKey,
      identifier: `Atividade ${nextKey + 1}`,
      optimisticValue: 0,
      mostProbableValue: 0,
      pessimisticValue: 0,
      criticalPath: true,
    };
    setActivities([...activities, newActivity]);
  };

  const activityRemoved = (activity: Activity) => {
    const newActivities = activities.filter(a => a.key !== activity.key);
    setActivities(newActivities);
  };

  return (
    <div className="App">
      <h1>Calculadora de PERT <small><i>(Program Evaluation and Review Technique)</i></small></h1>
      <Button icon="add" text="Adicionar Atividade" onClick={() => addActivity()}/>
      {activities.map(a => (<ActivityComponent key={a.key} activity={a} activityChanged={valueChanged} activityRemoved={activityRemoved} />))}
      <hr />
      <div>
        <h2>Resultados</h2>
        <table>
          <thead>
            <tr>
              <th style={{ width: "100px" }}>Atividade</th>
              <th style={{ width: "50px" }}>O</th>
              <th style={{ width: "50px" }}>MP</th>
              <th style={{ width: "50px" }}>P</th>
              <th style={{ width: "75px" }}>D<sub>e</sub></th>
              <th style={{ width: "75px" }}>≈δ</th>
              <th style={{ width: "75px" }}>Var</th>
              <th style={{ width: "100px" }}>a 68,2%</th>
              <th style={{ width: "100px" }}>a 95,5%</th>
              <th style={{ width: "100px" }}>a 99,8%</th>
            </tr>
          </thead>
          <tbody>
            {activities.filter(a => a.criticalPath).map(a => (
              <tr key={a.key}>
                <td>{a.identifier}</td>
                <td>{a.optimisticValue}</td>
                <td>{a.mostProbableValue}</td>
                <td>{a.pessimisticValue}</td>
                <td>{(a.estimatedDuration ?? 0).toFixed(1)}</td>
                <td>{(a.standardError ?? 0).toFixed(1)}</td>
                <td>{(a.variance ?? 0).toFixed(1)}</td>
                <td>{a.firstGauss?.[0].toFixed(1)} a {a.firstGauss?.[1].toFixed(1)}</td>
                <td>{a.secondGauss?.[0].toFixed(1)} a {a.secondGauss?.[1].toFixed(1)}</td>
                <td>{a.thirdGauss?.[0].toFixed(1)} a {a.secondGauss?.[1].toFixed(1)}</td>
              </tr>
            ))}
            <tr >
              <td colSpan={4}>Projeto</td>
              <td>{project.estimatedDuration?.toFixed(1)}</td>
              <td>{project.standardError?.toFixed(1)}</td>
              <td>{project.variance?.toFixed(1)}</td>
              <td>{project.firstGauss?.[0].toFixed(1)} a {project.firstGauss?.[1].toFixed(1)}</td>
              <td>{project.secondGauss?.[0].toFixed(1)} a {project.secondGauss?.[1].toFixed(1)}</td>
              <td>{project.thirdGauss?.[0].toFixed(1)} a {project.secondGauss?.[1].toFixed(1)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
