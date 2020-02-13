import chalk from "chalk";
import process from "process";

import libvirt, { domainDescToXml, DomainBuilder, domainDescFromXml, domainDescDeviceToXml} from "@vmngr/libvirt";

(async () => {

    const uri = process.env.LIBVIRT_URI || "qemu:///system";
    const hypervisor = new libvirt.Hypervisor({ uri });

    await hypervisor.connectOpen();

    const domain = await hypervisor.domainLookupByName("win10");
    const domainXml = await hypervisor.domainGetXMLDesc(domain);
    const domainTemplate = await domainDescFromXml(domainXml);
    const domainUpdated = new DomainBuilder()
        .addHostdev({
            type: "usb",
            mode: "subsystem",
            source: {
                vendor: { id: "0x046d" },
                product: { id: "0xc52b" },
            },
        })
        .build();

    const domainUpdatedXml = domainDescToXml(domainUpdated);

    const deviceXml = domainDescDeviceToXml(domainUpdated);

    process.stdout.write(`${deviceXml}`);

   // await hypervisor.domainCreateXML(domainUpdatedXml);

    /*const xmlstuff = await hypervisor.domainGetXMLDesc(domain);
    process.stdout.write(`This is the XML dump :-): ${xmlstuff}`);

    const hostname = await hypervisor.connectGetHostname();
    process.stdout.write(`Connected to ${hostname}!\n\n`);

    const activeDomains = await hypervisor.connectListAllDomains(
        libvirt.ConnectListAllDomainsFlags.ACTIVE);
    const inactiveDomains = await hypervisor.connectListAllDomains(
        libvirt.ConnectListAllDomainsFlags.INACTIVE);

    const activeDomainNames = await Promise.all(activeDomains
        .map((domain) => hypervisor.domainGetName(domain)));

    const inactiveDomainNames = await Promise.all(inactiveDomains
        .map((domain) => hypervisor.domainGetName(domain)));
    await hypervisor.connectClose();

    process.stdout.write("Active Domains\n");
    process.stdout.write("--------------\n");
    for (const name of activeDomainNames) {
        process.stdout.write(chalk.green(`  ${name}\n`));
    }
    process.stdout.write("\n");

    process.stdout.write("Inactive Domains\n");
    process.stdout.write("-----------------\n");
    for (const name of inactiveDomainNames) {
        process.stdout.write(chalk.red(`  ${name}\n`));
    }
    process.stdout.write("\n");*/

})();
