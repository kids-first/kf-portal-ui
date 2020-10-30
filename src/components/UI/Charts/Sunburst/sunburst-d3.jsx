import * as d3 from 'd3';

const WITH_FONT_COMPENSATION = 20;

const regexTermNumber = /^[(]HP:\d+\)$/;

const sunburstD3 = (ref, data, config, getSelectedPhenotype, formatters) => {
  const { tooltipFormatter, centerTextFormatter } = formatters;
  const width = config.width || 300;
  const height = config.height || 300;
  const depth = config.depth;
  const radius = Math.min(width, height) / 6;
  const colorScheme = config.colorScheme || 'schemeSet1';
  let selectedPhenotype = null;

  const addBackArrow = () => {
    g.append('line')
      .attr('id', 'back-arrow')
      .attr('x1', -6)
      .attr('y1', 60)
      .attr('x2', 6)
      .attr('y2', 60)
      .attr('stroke-width', 1)
      .attr('stroke', '#2b388f');
    g.append('line')
      .attr('id', 'back-arrow')
      .attr('x1', -6)
      .attr('y1', 60)
      .attr('x2', 0)
      .attr('y2', 66)
      .attr('stroke-width', 1)
      .attr('stroke', '#2b388f');
    g.append('line')
      .attr('id', 'back-arrow')
      .attr('x1', -6)
      .attr('y1', 60)
      .attr('x2', 0)
      .attr('y2', 54)
      .attr('stroke-width', 1)
      .attr('stroke', '#2b388f');
  };

  const arc = d3
    .arc()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .padAngle((d) => Math.min((d.x1 - d.x0) / 1.2, 0.04))
    .padRadius(radius)
    .innerRadius((d) => (d.y1 <= 2 ? d.y0 * (radius + 28) : d.y0 * (radius + 2)))
    .outerRadius((d) => Math.max(d.y0 * radius, d.y1 * radius - 2));

  const partition = (data) => {
    const root = d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);
    return d3.partition().size([2.0 * Math.PI, root.height + 1])(root);
  };

  const root = partition(data);
  const color = d3.scaleOrdinal(d3[colorScheme]);
  root.each((d) => (d.current = d));

  const svg = d3.select(ref.current).style('width', width).style('height', height);
  const g = svg.append('g').attr('transform', () => `translate(${[width / 2, width / 2]})`);

  const gData = g.append('g').selectAll('path').data(root.descendants());

  const path = gData
    .join('path')
    .attr('d', arc)
    .attr('fill', (d) => {
      while (d.depth > 1) d = d.parent;
      return color(d.data.title);
    })
    .attr('fill-opacity', (d) => (arcVisible(d.current) ? (d.children ? 0.8 : 0.4) : 0));

  path
    .filter((d) => d)
    .style('cursor', (d) => (arcVisible(d.current) ? 'pointer' : 'node'))
    .on('mouseover', function (p) {
      const data = d3.select(this).datum().current;
      return arcVisible(data) ? onMouseover(p) : () => {};
    })
    .on('mouseout', function () {
      const data = d3.select(this).datum().current;
      return arcVisible(data) ? onMouseout() : () => {};
    })
    .on('click', function (p) {
      const data = d3.select(this).datum().current;
      return arcVisible(data) ? clicked(p) : () => {};
    })
    .append('title')
    .text((d) => (arcVisible(d.current) ? tooltipFormatter(d.data) : ''));

  const parent = g
    .append('circle')
    .datum(root)
    .attr('r', radius * 1.5)
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .attr('text-anchor', 'middle')
    .style('cursor', 'pointer')
    .on('click', clicked);

  // center text
  // Only create the node if we have something to display
  if (centerTextFormatter) {
    var centerText = g
      .append('text')
      .lower()
      .datum(root)
      .text((d) => {
        selectedPhenotype = d;
        return centerTextFormatter(d.data);
      })
      .attr('x', (d) => d.x0)
      .attr('y', (d) => d.y0)
      .attr('text-anchor', 'middle')
      .style('cursor', 'pointer')
      .call(wrap);
  }
  g.append('circle')
    .raise()
    .datum(root)
    .lower()
    .attr('r', radius * 1.5)
    .attr('fill', '#F9F9FB')
    .attr('text-anchor', 'middle');

  // ACTIONS
  function wrap(selection) {
    // there is no centering of text with svg, need to do it manually
    selection.each(function () {
      let centerText = d3.select(this),
        words = centerText.text().split(/\s+/).reverse(),
        word,
        line = [],
        width = parent.node().getBoundingClientRect().width,
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = centerText.attr('y') - 10,
        dy = 0;

      let tspan = centerText
        .text(null)
        .append('tspan') // reset text, now hold in text variable
        .attr('x', 0)
        .attr('y', y)
        .attr('dy', dy + 'em');

      while ((word = words.pop())) {
        if (!regexTermNumber.test(word)) {
          line.push(word);
        }
        tspan.text(line.join(' ')).style('font', '13px sans-serif');
        if (!isNaN(word)) {
          tspan.text(line.join(' ')).style('font', '24px sans-serif');
          line.pop();
          centerText
            .append('tspan')
            .text(word)
            .attr('x', 0)
            .attr('y', -35)
            .attr('fill', '#2b388f')
            .style('font-size', '20px')
            .style('font-weight', '600');
          tspan.text(line.join(' ')).style('font', '24px sans-serif');
          line.pop();
          centerText
            .append('tspan')
            .text('participants with')
            .attr('x', 0)
            .attr('y', -20)
            .attr('fill', '#7D84A6')
            .style('font-size', '12px')
            .style('font-weight', '400');
        }

        //** - 20 ** with compensation for font size
        if (tspan.node().getComputedTextLength() > width - WITH_FONT_COMPENSATION) {
          line.pop();
          tspan.text(line.join(' '));
          centerText
            .append('tspan')
            .style('font-size', '14px')
            .style('font-weight', '600')
            .text(line.join(' '))
            .attr('fill', '#2b388f')
            .attr('x', 0)
            .attr('y', y)
            .attr('dy', ++lineNumber * lineHeight + dy + 'em');

          line = [word];
        }

        if (words.length === 0 && line.length >= 1) {
          const newTSpan = centerText.append('tspan');
          newTSpan
            .attr('x', 0)
            .attr('y', y)
            .attr('dy', ++lineNumber * lineHeight + dy + 'em')
            .style('font-size', '14px')
            .style('font-weight', '600')
            .text(line.join(' '))
            .attr('fill', '#2b388f');
        }
        tspan.text(''); // cleanup remaining parent text before quiting
      }
    });
  }

  function clicked(p) {
    parent.datum(p.parent || root);
    root.each(
      (d) =>
        (d.target = {
          x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
          x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
          y0: Math.max(0, d.y0 - p.depth),
          y1: Math.max(0, d.y1 - p.depth),
        }),
    );

    const t = g.transition().duration(300);

    // Transition the data on all arcs, even the ones that aren’t visible,
    // so that if this transition is interrupted, entering arcs will start
    // the next transition from the desired position.
    path
      .transition(t)
      .filter(function (d) {
        return +this.getAttribute('fill-opacity') || arcVisible(d.target);
      })
      .tween('data', (d) => (t) => (d.current = d3.interpolate(d.current, d.target)(t)))
      .attrTween('d', (d) => () => arc(d.current))
      .attr('fill-opacity', (d) => (arcVisible(d.target) ? (d.children ? 0.7 : 0.4) : 0));

    selectedPhenotype = p;
    if (centerText) {
      centerText.call(() => updateCenterText(p));
      getSelectedPhenotype(p.data);
    }

    g.selectAll('#back-arrow').remove();
    if (p.parent) {
      addBackArrow();
    }
  }

  function arcVisible(d) {
    return d.y1 <= depth + 1 && d.y0 >= 1 && d.x1 > d.x0;
  }

  const onMouseover = (d) => {
    updateCenterText(d);
  };

  const onMouseout = () => {
    updateCenterText();
  };

  const updateCenterText = (p) => {
    if (!centerTextFormatter) return;
    const textData = p || selectedPhenotype;
    centerText.text(() => centerTextFormatter(textData.data)).call(wrap);
  };
};

export default sunburstD3;
