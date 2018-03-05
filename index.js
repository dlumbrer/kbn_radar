export default function (kibana) {

  return new kibana.Plugin({
    uiExports: {
      visTypes: [
        'plugins/kbn_radar/kbn_radar'
      ]
    }
  });

}
