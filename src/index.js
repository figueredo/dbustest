import DBus from 'dbus'

const SERVICE_NAME = 'br.org.cesar.KNoT';
const SETUP_INTERFACE_NAME = 'br.org.cesar.KNoT.Setup';
const SETUP_OBJECT_PATH = '/br/org/cesar/KNoT/Setup';

const State = {
  Ready: 1,
  Setup: 2
};

class Setup {
  constructor() {
    this.state = State.Setup;
  }

  Setup(done) {
    this.state = State.Ready;
    done();
  }

  FactoryReset(done) {
    this.state = State.Setup;
    done();
  }

  ThrowError(done) {
    const error = new Error('Test error');
    done(error);
  }

  get State() {
    return this.state;
  }
};

const setup = new Setup();

const service = DBus.registerService('session', SERVICE_NAME);
const object = service.createObject(SETUP_OBJECT_PATH);
const iface = object.createInterface(SETUP_INTERFACE_NAME);
iface.addMethod('Setup', {}, setup.Setup.bind(setup));
iface.addMethod('FactoryReset', {}, setup.FactoryReset.bind(setup));
iface.addMethod('ThrowError', {}, function ThrowError(done) {
  setup.ThrowError(function onDone(error) {
    console.log(error);
    if (error) {
      const dbusError = new DBus.Error('br.org.cesar.KNoT.Error', error.message);
      console.log(dbusError);
      return done(dbusError);
    }
    done();
  });
});
iface.addProperty('State', {
  type: DBus.Define(Number),
  getter: function getState(done) {
    done(null, setup.State);
  }
});
iface.update();

console.log('Running');