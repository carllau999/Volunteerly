
import { Event, EventType, Organization } from "../../db/models"
import {sequelize} from "../../db"
import { Request, Response } from "express";


const getEvents = async (req: Request, res: Response) => {
  //const { userId, availability, timeRanges } = req.body;

  try {
      const events = await sequelize.sync().then(()=>Event.findAll({
        include: [Organization]}));
      return res.send({
          statusCode: 200,
          body: JSON.stringify(events)
      });
  } catch (err) {
      console.log(`Failed to get events - ${err.message}`)
      return res.send({
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: err.message || 'Could not fetch the Enrollment.'
      })
  }
}

const addEvent = async (req: Request, res: Response) => {
  const event =  req.body;
  // find event id from event type tabel using event.eventType
  let eventId;
  try {
    const currEventType = await sequelize.sync().then(()=>EventType.findAll({
      where: {
        text: event.eventType
      }
    }));
    eventId = currEventType[0].id
  } catch (err) {
      console.log(`Failed to get event type - ${err.message}`)
      return res.send({
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: err.message || 'Could not fetch the Enrollment.'
      })
  }
  // use id to create event
  event.event_category_id = eventId
  event.time_range = event.timeRange
  delete event.timeRange
  delete event.eventType
  let newEvent;

  try {
    newEvent = await sequelize.sync().then(()=> Event.create(event))
    
  } catch (err) {
      console.log(`Failed to create events - ${err.message}`)
      console.log({err});
      
      return res.send({
          statusCode: err.statusCode,
          headers: { 'Content-Type': 'text/plain' },
          body: err.message
      })
  }

  // after creating event send back all events of the organization_id 

  await getEvents(req, res);
}


const deleteEvent = async (req: Request, res: Response) => {
  const {event_id} = req.params;
  try {
    const deletedEvent = await sequelize.sync().then(()=>Event.destroy({
      where: {
        id: event_id
      }
    }));
    console.log({deletedEvent});
    if (deletedEvent == 0){
      return res.send({
        statusCode: 200,
        body: []
      });
    }
  } catch (err) {
      console.log(`Failed to delete event - ${err.message}`)
      return res.send({
          statusCode: err.statusCode,
          headers: { 'Content-Type': 'text/plain' },
          body: err.message
      })
  }
  await getEvents(req, res);

}

const getEventsByUser = async (req: Request, res: Response) => {
  //const { userId, availability, timeRanges } = req.body;
  const { id } = req.params;
  console.log(`Getting events`)
  try {
      const events = await sequelize.sync().then(()=>Event.findAll({
        where: {
          organization_id: id
        },
        include: [Organization]
      }));
      return res.send({
          statusCode: 200,
          body: JSON.stringify(events)
      });
  } catch (err) {
      console.log(`Failed to get events - ${err.message}`)
      return res.send({
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: err.message || 'Could not fetch the Enrollment.'
      })
  }
}


export  { getEventsByUser, addEvent, getEvents, deleteEvent }